/**
 * 图片修复核心逻辑
 * 使用 OpenCV.js 的 cv.inpaint() 实现去水印
 */

import { getCV } from './opencv-loader'

export interface InpaintOptions {
  /** 修复半径 (px)，默认 5，范围 1-20 */
  inpaintRadius?: number
  /** 修复算法: 'telea' | 'ns'，默认 'telea' */
  algorithm?: 'telea' | 'ns'
}

/**
 * 对图片指定区域进行修复（去水印）
 *
 * @param imageSource - 原始图片（HTMLImageElement 或 ImageData）
 * @param maskRects  - 需要修复的矩形区域数组 [{x, y, width, height}]
 * @param options    - 修复选项
 * @returns 修复后的 ImageData
 */
export async function inpaintImage(
  imageSource: HTMLImageElement,
  maskRects: Array<{ x: number; y: number; width: number; height: number }>,
  options: InpaintOptions = {}
): Promise<ImageData> {
  const cv = getCV()
  const { inpaintRadius = 5, algorithm = 'telea' } = options

  // 1. 读取原始图片
  //    cv.imread() 返回 RGBA 4 通道 Mat，但 cv.inpaint() 要求 1 或 3 通道
  const srcRGBA = cv.imread(imageSource)
  if (!srcRGBA || srcRGBA.empty()) {
    throw new Error($t('cant-read-image'))
  }

  const imgWidth = srcRGBA.cols
  const imgHeight = srcRGBA.rows

  // 2. 通道转换：RGBA(4ch) → BGR(3ch)
  //    必须剥离 Alpha 通道，否则 cv.inpaint() 会因为通道数不匹配崩溃
  const srcBGR = new cv.Mat()
  cv.cvtColor(srcRGBA, srcBGR, cv.COLOR_RGBA2BGR)
  srcRGBA.delete() // 4 通道原图已不需要

  // 3. 创建遮罩（mask）：黑色背景 + 白色选区
  const maskMat = cv.Mat.zeros(imgHeight, imgWidth, cv.CV_8UC1)

  for (const rect of maskRects) {
    const rx = Math.max(0, Math.floor(rect.x))
    const ry = Math.max(0, Math.floor(rect.y))
    const rw = Math.min(imgWidth - rx, Math.ceil(rect.width))
    const rh = Math.min(imgHeight - ry, Math.ceil(rect.height))

    if (rw > 0 && rh > 0) {
      cv.rectangle(
        maskMat,
        new cv.Point(rx, ry),
        new cv.Point(rx + rw, ry + rh),
        new cv.Scalar(255),
        -1
      )
    }
  }

  // 4. 执行修复（工作在 BGR 3 通道上）
  const dstBGR = new cv.Mat()
  const algoFlag = algorithm === 'ns' ? cv.INPAINT_NS : cv.INPAINT_TELEA
  cv.inpaint(srcBGR, maskMat, dstBGR, inpaintRadius, algoFlag)

  // 5. 转回 RGBA（Canvas 需要 RGBA 才能正确显示）
  const dstRGBA = new cv.Mat()
  cv.cvtColor(dstBGR, dstRGBA, cv.COLOR_BGR2RGBA)

  // 6. 渲染到 Canvas 并提取 ImageData
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = imgWidth
  tempCanvas.height = imgHeight
  cv.imshow(tempCanvas, dstRGBA)

  const ctx = tempCanvas.getContext('2d')
  if (!ctx) {
    throw new Error($t('cant-create-2d'))
  }
  const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight)

  // 7. 释放所有 Mat（OpenCV WASM 需手动管理内存）
  srcBGR.delete()
  maskMat.delete()
  dstBGR.delete()
  dstRGBA.delete()

  return imageData
}

/**
 * 将 ImageData 渲染到目标 Canvas 上
 * @param targetWidth  可选，目标显示宽度（默认原图分辨率）
 * @param targetHeight 可选，目标显示高度
 */
export function renderImageDataToCanvas(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  targetWidth?: number,
  targetHeight?: number
): void {
  if (targetWidth && targetHeight) {
    // 缩放渲染：先绘制到临时 canvas，再 drawImage 缩放到目标尺寸
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = imageData.width
    tempCanvas.height = imageData.height
    const tempCtx = tempCanvas.getContext('2d')
    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0)
    }

    canvas.width = targetWidth
    canvas.height = targetHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // 关闭平滑会使像素图更锐利，但对照片类图片保持默认平滑
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight)
    }
  } else {
    // 原图分辨率
    canvas.width = imageData.width
    canvas.height = imageData.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.putImageData(imageData, 0, 0)
    }
  }
}

/**
 * 从 File 对象加载 HTMLImageElement
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error($t('fail-load-image')))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error($t('fail-load-file')))
    reader.readAsDataURL(file)
  })
}

/**
 * 从 Canvas 导出为 Blob（用于下载）
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type: 'image/png' | 'image/jpeg' = 'image/png', quality = 0.98): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error($t('fail-canvas-export')))
      },
      type,
      quality
    )
  })
}
