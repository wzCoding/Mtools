/**
 * 高质量去水印 —— 主进程 IPC Handler
 * 方案：Sharp (预处理) → ONNX Runtime → LaMa 模型 (AI 修复)
 *
 * 模型下载：
 *   从 HuggingFace 下载 LaMa ONNX 模型，放到项目根目录 models/ 下
 *   推荐模型: https://huggingface.co/boomb0om/LaMa-inpainting-onnx
 *   下载文件: lama_fp32.onnx 或 lama.onnx
 *   放置路径: <项目根目录>/models/lama.onnx
 */

import { ipcMain, BrowserWindow } from 'electron'
import sharp from 'sharp'
import * as ort from 'onnxruntime-node'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'

// ─── 模型路径 ───
function getModelPath(): string {
  // 1. 与主进程同目录（dev 时 = 项目根目录）
  const localPath = path.join(app.getAppPath(), 'models', 'lama.onnx')
  if (fs.existsSync(localPath)) return localPath

  // 2. 项目根目录（dist-electron/main/ 的祖父目录，避免每次构建复制 200MB）
  const rootPath = path.resolve(app.getAppPath(), '..', '..', 'models', 'lama.onnx')
  if (fs.existsSync(rootPath)) return rootPath

  // 3. 生产环境 extraResources
  const prodPath = path.join(process.resourcesPath, 'models', 'lama.onnx')
  if (fs.existsSync(prodPath)) return prodPath

  return rootPath // 默认返回项目根路径，让 ONNX 报清晰的错误
}

// ─── 模型缓存 ───
let sessionCache: ort.InferenceSession | null = null

async function getSession(): Promise<ort.InferenceSession> {
  if (sessionCache) return sessionCache

  const modelPath = getModelPath()
  if (!fs.existsSync(modelPath)) {
    throw new Error(
      `LaMa 模型文件不存在: ${modelPath}\n` +
      `请从 HuggingFace 下载: https://huggingface.co/Carve/LaMa-ONNX` +
      `下载后放置到: ${path.dirname(modelPath)}/`
    )
  }

  console.log('[LaMa] 加载模型:', modelPath)
  sessionCache = await ort.InferenceSession.create(modelPath, {
    executionProviders: ['cpu'], // Electron 主进程用 CPU
    graphOptimizationLevel: 'all',
  })
  console.log('[LaMa] 模型加载完成')
  return sessionCache
}

// ─── 预处理：图片 → 512×512 标准化 tensor ───
async function preprocessImage(imageBuffer: Buffer): Promise<{
  tensor: Float32Array
  originalWidth: number
  originalHeight: number
}> {
  const { data, info } = await sharp(imageBuffer)
    .resize(512, 512, { fit: 'fill', kernel: 'lanczos3' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width: originalWidth, height: originalHeight } = await sharp(imageBuffer).metadata()

  // RGB → NCHW → Float32 归一化 [0, 1]
  const tensor = new Float32Array(1 * 3 * 512 * 512)
  const pixels = data.length / 3
  for (let i = 0; i < pixels; i++) {
    tensor[i] = data[i * 3] / 255.0           // R
    tensor[pixels + i] = data[i * 3 + 1] / 255.0 // G
    tensor[2 * pixels + i] = data[i * 3 + 2] / 255.0 // B
  }

  return { tensor, originalWidth: originalWidth!, originalHeight: originalHeight! }
}

// ─── 预处理：mask → 512×512 单通道 tensor ───
async function preprocessMask(maskBuffer: Buffer): Promise<Float32Array> {
  const { data } = await sharp(maskBuffer)
    .resize(512, 512, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // HWC grayscale → NCHW → Float32 归一化 [0, 1]，>128 视为 mask 区域
  const tensor = new Float32Array(1 * 1 * 512 * 512)
  for (let i = 0; i < 512 * 512; i++) {
    tensor[i] = data[i] > 128 ? 1.0 : 0.0
  }

  return tensor
}

// ─── 后处理：tensor → 缩放回原始尺寸 → 与原图合成 ───
async function postprocess(
  outputTensor: Float32Array,
  originalWidth: number,
  originalHeight: number,
  originalImageBuffer: Buffer,
  maskBuffer: Buffer
): Promise<Buffer> {
  // 1. tensor → 512×512 RGBA PNG buffer
  const inpaintedPixels = new Uint8Array(512 * 512 * 3)
  const pixels = 512 * 512
  for (let i = 0; i < pixels; i++) {
    inpaintedPixels[i * 3] = Math.round(Math.max(0, Math.min(1, outputTensor[i])) * 255)
    inpaintedPixels[i * 3 + 1] = Math.round(Math.max(0, Math.min(1, outputTensor[pixels + i])) * 255)
    inpaintedPixels[i * 3 + 2] = Math.round(Math.max(0, Math.min(1, outputTensor[2 * pixels + i])) * 255)
  }

  const inpainted512Buffer = await sharp(inpaintedPixels, {
    raw: { width: 512, height: 512, channels: 3 },
  })
    .png()
    .toBuffer()

  // 2. 缩放回原始尺寸
  const inpaintedFullBuffer = await sharp(inpainted512Buffer)
    .resize(originalWidth, originalHeight, { fit: 'fill', kernel: 'lanczos3' })
    .png()
    .toBuffer()

  // 3. 用 mask 合成：mask 区域用修复结果，其余保留原图
  const maskFullBuffer = await sharp(maskBuffer)
    .resize(originalWidth, originalHeight, { fit: 'fill' })
    .greyscale()
    .png()
    .toBuffer()

  return await sharp(originalImageBuffer)
    .composite([
      {
        input: inpaintedFullBuffer,
        blend: 'over',
      },
    ])
    .png()
    .toBuffer()
}

// ─── 注册 IPC Handler ───
export function registerInpaintLaMaHandler(win: BrowserWindow) {
  ipcMain.handle('inpaint:lama', async (_event, payload: {
    imageBuffer: Buffer
    maskBuffer: Buffer
    options?: { upscale?: boolean }
  }) => {
    try {
      console.log('[LaMa] 开始处理...')
      const session = await getSession()

      // 预处理
      const { tensor: imageTensor, originalWidth, originalHeight } = await preprocessImage(payload.imageBuffer)
      const maskTensor = await preprocessMask(payload.maskBuffer)

      // ONNX 推理
      const imageOrt = new ort.Tensor('float32', imageTensor, [1, 3, 512, 512])
      const maskOrt = new ort.Tensor('float32', maskTensor, [1, 1, 512, 512])

      console.log('[LaMa] 推理中...')
      const results = await session.run({ image: imageOrt, mask: maskOrt })
      const outputTensor = results.output.data as Float32Array
      console.log('[LaMa] 推理完成')

      // 后处理
      const resultBuffer = await postprocess(
        outputTensor,
        originalWidth,
        originalHeight,
        payload.imageBuffer,
        payload.maskBuffer
      )

      return { success: true, data: resultBuffer }
    } catch (err: any) {
      console.error('[LaMa] 处理失败:', err)
      return { success: false, error: err.message }
    }
  })
}
