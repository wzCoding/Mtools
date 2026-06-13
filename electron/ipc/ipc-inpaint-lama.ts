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
      `[LaMa] Model not found: ${modelPath}\n` +
      `Download from: https://huggingface.co/Carve/LaMa-ONNX\n` +
      `Place in: ${path.dirname(modelPath)}/`
    )
  }

  console.log('[LaMa] Loading model:', modelPath)
  sessionCache = await ort.InferenceSession.create(modelPath, {
    executionProviders: ['cpu'], // Electron 主进程用 CPU
    graphOptimizationLevel: 'all',
  })
  console.log('[LaMa] Model loaded')
  return sessionCache
}

// ─── 调试辅助 ───
function tensorStats(label: string, t: Float32Array, channels: number) {
  const perCh = t.length / channels
  for (let c = 0; c < channels; c++) {
    let min = Infinity, max = -Infinity, sum = 0
    for (let i = 0; i < perCh; i++) {
      const v = t[c * perCh + i]
      if (v < min) min = v; if (v > max) max = v; sum += v
    }
    console.log(`[LaMa] ${label} ch${c}: min=${min.toFixed(4)} max=${max.toFixed(4)} mean=${(sum/perCh).toFixed(4)}`)
  }
}

// ─── 预处理：图片 → 512×512 tensor（尝试 [0,1] 归一化）───
async function preprocessImage(imageBuffer: Buffer): Promise<{
  tensor: Float32Array
  originalWidth: number
  originalHeight: number
}> {
  const { data } = await sharp(imageBuffer)
    .resize(512, 512, { fit: 'fill', kernel: 'lanczos3' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width: originalWidth, height: originalHeight } = await sharp(imageBuffer).metadata()

  const pixels = 512 * 512
  const tensor = new Float32Array(1 * 3 * pixels)
  for (let i = 0; i < pixels; i++) {
    tensor[i] = data[i * 3] / 255.0
    tensor[pixels + i] = data[i * 3 + 1] / 255.0
    tensor[2 * pixels + i] = data[i * 3 + 2] / 255.0
  }
  tensorStats('Image input', tensor, 3)
  return { tensor, originalWidth: originalWidth!, originalHeight: originalHeight! }
}

// ─── 预处理：mask → 512×512 单通道 tensor ───
async function preprocessMask(maskBuffer: Buffer): Promise<Float32Array> {
  const { data } = await sharp(maskBuffer)
    .resize(512, 512, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = 512 * 512
  const tensor = new Float32Array(1 * 1 * pixels)
  for (let i = 0; i < pixels; i++) {
    tensor[i] = data[i] > 128 ? 1.0 : 0.0
  }
  tensorStats('Mask input', tensor, 1)
  return tensor
}

// ─── tensor → Uint8Array RGB pixels ───
function tensorToPixels(t: Float32Array): Uint8Array {
  const pixels = 512 * 512
  const out = new Uint8Array(pixels * 3)
  // 检测输出值域：[0,1] 还是 [0,255]（此模型输出 [0,255]）
  let maxVal = 0
  for (let i = 0; i < pixels * 3; i++) { if (t[i] > maxVal) maxVal = t[i] }
  const scale = maxVal > 2 ? 1 : 255
  for (let i = 0; i < pixels; i++) {
    let r = t[i], g = t[pixels + i], b = t[2 * pixels + i]
    if (r < 0 || g < 0 || b < 0) { r = (r+1)/2; g = (g+1)/2; b = (b+1)/2 }
    out[i*3]   = Math.round(Math.max(0, Math.min(255, r * scale)))
    out[i*3+1] = Math.round(Math.max(0, Math.min(255, g * scale)))
    out[i*3+2] = Math.round(Math.max(0, Math.min(255, b * scale)))
  }
  return out
}

// ─── 后处理：mask 引导合成 ───
async function postprocessWithMask(
  outputTensor: Float32Array,
  originalWidth: number,
  originalHeight: number,
  originalImageBuffer: Buffer,
  maskBuffer: Buffer
): Promise<Buffer> {
  tensorStats('Model output', outputTensor, 3)
  const inpaintedPixels = tensorToPixels(outputTensor)

  // 1. AI 结果 → 原图尺寸 raw RGB
  const { data: aiData } = await sharp(inpaintedPixels, {
    raw: { width: 512, height: 512, channels: 3 },
  }).resize(originalWidth, originalHeight, { fit: 'fill', kernel: 'lanczos3' })
    .raw().toBuffer({ resolveWithObject: true })

  // 2. mask → 原图尺寸 raw grayscale
  const { data: maskData } = await sharp(maskBuffer)
    .resize(originalWidth, originalHeight, { fit: 'fill' })
    .greyscale().threshold(128)
    .raw().toBuffer({ resolveWithObject: true })

  // 3. 原图 → 原图尺寸 raw RGB（用于逐像素拷贝，零损失）
  const { data: origData } = await sharp(originalImageBuffer)
    .resize(originalWidth, originalHeight, { fit: 'fill' })
    .removeAlpha()
    .raw().toBuffer({ resolveWithObject: true })

  // 4. 像素级融合：mask 区取 AI，非 mask 区逐字节拷贝原图
  const total = originalWidth * originalHeight
  const merged = new Uint8Array(total * 3)
  for (let i = 0; i < total; i++) {
    if (maskData[i] > 128) {
      merged[i*3]=aiData[i*3]; merged[i*3+1]=aiData[i*3+1]; merged[i*3+2]=aiData[i*3+2]
    } else {
      merged[i*3]=origData[i*3]; merged[i*3+1]=origData[i*3+1]; merged[i*3+2]=origData[i*3+2]
    }
  }

  return await sharp(merged, {
    raw: { width: originalWidth, height: originalHeight, channels: 3 },
  }).png().toBuffer()
}

// ─── 注册 IPC Handler ───
export function registerInpaintLaMaHandler(win: BrowserWindow) {
  ipcMain.handle('inpaint:lama', async (_event, payload: {
    imageBuffer: ArrayBuffer
    maskBuffer: ArrayBuffer
    options?: { upscale?: boolean }
  }) => {
    try {
  console.log('[LaMa] ===== Request received =====')
      // Electron IPC 传递的是 ArrayBuffer，Sharp 需要 Buffer
      const imgBuf = Buffer.from(payload.imageBuffer)
      const maskBuf = Buffer.from(payload.maskBuffer)

      console.log('[LaMa] Processing...')
      const session = await getSession()
      console.log(session.inputMetadata)
      // 动态获取模型输入/输出名（不同 LaMa 版本名称可能不同）
      const inputNames  = session.inputNames
      const outputNames = session.outputNames
      console.log('[LaMa] Model inputs:', inputNames, 'outputs:', outputNames)

      const imgInputName = inputNames[0]   // 通常为 "image" 或 "input"
      const maskInputName = inputNames[1]  // 通常为 "mask"
      const outName = outputNames[0]       // 通常为 "output"

      // 预处理
      const { tensor: imageTensor, originalWidth, originalHeight } = await preprocessImage(imgBuf)
      const maskTensor = await preprocessMask(maskBuf)

      // ONNX 推理（使用模型实际名称）
      const imageOrt = new ort.Tensor('float32', imageTensor, [1, 3, 512, 512])
      const maskOrt = new ort.Tensor('float32', maskTensor, [1, 1, 512, 512])

      console.log('[LaMa] Inferencing...')
      const results = await session.run({
        [imgInputName]: imageOrt,
        [maskInputName]: maskOrt,
      })
      const outputTensor = (results[outName] as ort.Tensor).data as Float32Array
      console.log('[LaMa] Inference done')

      const resultBuffer = await postprocessWithMask(
        outputTensor, originalWidth, originalHeight, imgBuf, maskBuf
      )

      return { success: true, data: resultBuffer }
    } catch (err: any) {
      console.error('[LaMa] 处理失败:', err)
      return { success: false, error: err.message }
    }
  })
}
