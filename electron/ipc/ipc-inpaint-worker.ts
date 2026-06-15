import { parentPort, workerData } from 'worker_threads'
import sharp from 'sharp'
import * as ort from 'onnxruntime-node'
import path from 'path'
import fs from 'fs'

const modelPath: string = workerData.modelPath

let sessionCache: ort.InferenceSession | null = null

async function getSession(): Promise<ort.InferenceSession> {
  if (sessionCache) return sessionCache

  if (!fs.existsSync(modelPath)) {
    throw new Error(
      `[LaMa Worker] Model not found: ${modelPath}\n` +
      `Download from: https://huggingface.co/Carve/LaMa-ONNX\n` +
      `Place in: ${path.dirname(modelPath)}/`
    )
  }

  console.log('[LaMa Worker] Loading model:', modelPath)
  sessionCache = await ort.InferenceSession.create(modelPath, {
    executionProviders: ['cpu'],
    graphOptimizationLevel: 'all',
  })
  console.log('[LaMa Worker] Model loaded')
  return sessionCache
}

function tensorStats(label: string, t: Float32Array, channels: number) {
  const perCh = t.length / channels
  for (let c = 0; c < channels; c++) {
    let min = Infinity, max = -Infinity, sum = 0
    for (let i = 0; i < perCh; i++) {
      const v = t[c * perCh + i]
      if (v < min) min = v; if (v > max) max = v; sum += v
    }
    console.log(`[LaMa Worker] ${label} ch${c}: min=${min.toFixed(4)} max=${max.toFixed(4)} mean=${(sum / perCh).toFixed(4)}`)
  }
}

interface CropRegion {
  x: number; y: number; width: number; height: number
}

interface PadInfo {
  top: number; bottom: number; left: number; right: number
  scaledWidth: number; scaledHeight: number
}

async function computeMaskBbox(maskBuffer: Buffer): Promise<{
  x: number; y: number; width: number; height: number
  imgWidth: number; imgHeight: number
  hasMask: boolean
}> {
  const metadata = await sharp(maskBuffer).metadata()
  const imgWidth = metadata.width!
  const imgHeight = metadata.height!

  const { data } = await sharp(maskBuffer)
    .greyscale().raw().toBuffer({ resolveWithObject: true })

  let minX = imgWidth, minY = imgHeight, maxX = 0, maxY = 0
  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      if (data[y * imgWidth + x] > 128) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  const hasMask = minX <= maxX && minY <= maxY
  if (!hasMask) {
    return { x: 0, y: 0, width: imgWidth, height: imgHeight, imgWidth, imgHeight, hasMask: false }
  }

  return {
    x: minX, y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    imgWidth, imgHeight,
    hasMask: true,
  }
}

function padBbox(
  bbox: CropRegion,
  imgWidth: number,
  imgHeight: number,
  paddingRatio: number = 0.15
): CropRegion {
  let padding = Math.round(Math.max(bbox.width, bbox.height) * paddingRatio)
  padding = Math.max(16, Math.min(128, padding))

  if (bbox.width <= 512 && bbox.height <= 512) {
    const maxPadFor1to1 = Math.min(
      Math.floor((512 - bbox.width) / 2),
      Math.floor((512 - bbox.height) / 2)
    )
    padding = Math.min(padding, Math.max(16, maxPadFor1to1))
  }

  const x = Math.max(0, bbox.x - padding)
  const y = Math.max(0, bbox.y - padding)
  const width = Math.min(imgWidth - x, bbox.width + padding * 2)
  const height = Math.min(imgHeight - y, bbox.height + padding * 2)
  return { x, y, width, height }
}

async function prepareImagePatch(imageBuffer: Buffer): Promise<{
  tensor: Float32Array
  padInfo: PadInfo
}> {
  const metadata = await sharp(imageBuffer).metadata()
  const w = metadata.width!, h = metadata.height!

  const scale = Math.min(1.0, 512 / w, 512 / h)
  const scaledW = Math.round(w * scale)
  const scaledH = Math.round(h * scale)

  const padLeft = Math.floor((512 - scaledW) / 2)
  const padRight = 512 - scaledW - padLeft
  const padTop = Math.floor((512 - scaledH) / 2)
  const padBottom = 512 - scaledH - padTop

  const { data } = await sharp(imageBuffer)
    .resize(scaledW, scaledH, { fit: 'fill', kernel: 'lanczos3' })
    .removeAlpha()
    .extend({
      top: padTop, bottom: padBottom,
      left: padLeft, right: padRight,
      background: { r: 0, g: 0, b: 0 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = 512 * 512
  const tensor = new Float32Array(1 * 3 * pixels)
  for (let i = 0; i < pixels; i++) {
    tensor[i] = data[i * 3] / 255.0
    tensor[pixels + i] = data[i * 3 + 1] / 255.0
    tensor[2 * pixels + i] = data[i * 3 + 2] / 255.0
  }
  tensorStats('Image input', tensor, 3)
  return {
    tensor,
    padInfo: { top: padTop, bottom: padBottom, left: padLeft, right: padRight, scaledWidth: scaledW, scaledHeight: scaledH },
  }
}

async function prepareMaskPatch(maskBuffer: Buffer): Promise<{
  tensor: Float32Array
  padInfo: PadInfo
}> {
  const metadata = await sharp(maskBuffer).metadata()
  const w = metadata.width!, h = metadata.height!

  const scale = Math.min(1.0, 512 / w, 512 / h)
  const scaledW = Math.round(w * scale)
  const scaledH = Math.round(h * scale)

  const padLeft = Math.floor((512 - scaledW) / 2)
  const padRight = 512 - scaledW - padLeft
  const padTop = Math.floor((512 - scaledH) / 2)
  const padBottom = 512 - scaledH - padTop

  const { data } = await sharp(maskBuffer)
    .resize(scaledW, scaledH, { fit: 'fill' })
    .greyscale()
    .extend({
      top: padTop, bottom: padBottom,
      left: padLeft, right: padRight,
      background: { r: 0, g: 0, b: 0 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = 512 * 512
  const tensor = new Float32Array(1 * 1 * pixels)
  for (let i = 0; i < pixels; i++) {
    tensor[i] = data[i] > 128 ? 1.0 : 0.0
  }
  tensorStats('Mask input', tensor, 1)
  return {
    tensor,
    padInfo: { top: padTop, bottom: padBottom, left: padLeft, right: padRight, scaledWidth: scaledW, scaledHeight: scaledH },
  }
}

function tensorToPixels(t: Float32Array): Uint8Array {
  const pixels = 512 * 512
  const out = new Uint8Array(pixels * 3)
  let maxVal = 0
  for (let i = 0; i < pixels * 3; i++) { if (t[i] > maxVal) maxVal = t[i] }
  const scale = maxVal > 2 ? 1 : 255
  for (let i = 0; i < pixels; i++) {
    let r = t[i], g = t[pixels + i], b = t[2 * pixels + i]
    if (r < 0 || g < 0 || b < 0) { r = (r + 1) / 2; g = (g + 1) / 2; b = (b + 1) / 2 }
    out[i * 3] = Math.round(Math.max(0, Math.min(255, r * scale)))
    out[i * 3 + 1] = Math.round(Math.max(0, Math.min(255, g * scale)))
    out[i * 3 + 2] = Math.round(Math.max(0, Math.min(255, b * scale)))
  }
  return out
}

async function restorePatch(
  outputTensor: Float32Array,
  padInfo: PadInfo,
  originalWidth: number,
  originalHeight: number
): Promise<Buffer> {
  tensorStats('Model output', outputTensor, 3)
  const fullPixels = tensorToPixels(outputTensor)

  return sharp(fullPixels, {
    raw: { width: 512, height: 512, channels: 3 },
  })
    .extract({
      left: padInfo.left,
      top: padInfo.top,
      width: padInfo.scaledWidth,
      height: padInfo.scaledHeight,
    })
    .resize(originalWidth, originalHeight, { fit: 'fill', kernel: 'lanczos3' })
    .png()
    .toBuffer()
}

async function createFeatherMask(maskBuffer: Buffer, sigma: number = 3): Promise<Buffer> {
  return sharp(maskBuffer)
    .greyscale()
    .blur(sigma)
    .png()
    .toBuffer()
}

async function featherBlend(
  aiBuffer: Buffer,
  originalBuffer: Buffer,
  featherMaskBuffer: Buffer,
): Promise<Buffer> {
  const aiMeta = await sharp(aiBuffer).metadata()
  const w = aiMeta.width!, h = aiMeta.height!

  const [
    { data: aiData },
    { data: origData },
    { data: maskData },
  ] = await Promise.all([
    sharp(aiBuffer).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(originalBuffer).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(featherMaskBuffer).resize(w, h).greyscale().raw().toBuffer({ resolveWithObject: true }),
  ])

  const total = w * h
  const blended = new Uint8Array(total * 3)
  for (let i = 0; i < total; i++) {
    const alpha = maskData[i] / 255
    blended[i * 3] = Math.round(aiData[i * 3] * alpha + origData[i * 3] * (1 - alpha))
    blended[i * 3 + 1] = Math.round(aiData[i * 3 + 1] * alpha + origData[i * 3 + 1] * (1 - alpha))
    blended[i * 3 + 2] = Math.round(aiData[i * 3 + 2] * alpha + origData[i * 3 + 2] * (1 - alpha))
  }

  return sharp(blended, {
    raw: { width: w, height: h, channels: 3 },
  }).png().toBuffer()
}

async function tiledInpaint(
  cropImgBuf: Buffer,
  cropMaskBuf: Buffer,
  cropW: number,
  cropH: number,
  session: ort.InferenceSession,
  imgInputName: string,
  maskInputName: string,
  outName: string
): Promise<Buffer> {
  const TILE = 512, OVERLAP = 64
  const stride = TILE - OVERLAP
  const cols = Math.max(1, Math.ceil((cropW - OVERLAP) / stride))
  const rows = Math.max(1, Math.ceil((cropH - OVERLAP) / stride))

  console.log(`[LaMa Worker] Tiling: ${cols}×${rows} tiles for ${cropW}×${cropH} crop`)

  const acc = new Float32Array(cropW * cropH * 3)
  const weightSum = new Float32Array(cropW * cropH)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let left = col * stride
      let top = row * stride
      if (col === cols - 1) left = cropW - TILE
      if (row === rows - 1) top = cropH - TILE
      if (left < 0) left = 0
      if (top < 0) top = 0
      const tw = Math.min(TILE, cropW - left)
      const th = Math.min(TILE, cropH - top)

      console.log(`[LaMa Worker]   Tile [${row},${col}]: (${left},${top}) ${tw}×${th}`)

      const tileImg = await sharp(cropImgBuf)
        .extract({ left, top, width: tw, height: th }).png().toBuffer()
      const tileMask = await sharp(cropMaskBuf)
        .extract({ left, top, width: tw, height: th }).png().toBuffer()

      const { tensor: imgTensor, padInfo } = await prepareImagePatch(tileImg)
      const { tensor: maskTensor } = await prepareMaskPatch(tileMask)

      const results = await session.run({
        [imgInputName]: new ort.Tensor('float32', imgTensor, [1, 3, 512, 512]),
        [maskInputName]: new ort.Tensor('float32', maskTensor, [1, 1, 512, 512]),
      })
      const outTensor = (results[outName] as ort.Tensor).data as Float32Array
      const tileResult = await restorePatch(outTensor, padInfo, tw, th)

      const { data: tilePx } = await sharp(tileResult)
        .removeAlpha().raw().toBuffer({ resolveWithObject: true })

      for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
          const cx = left + x, cy = top + y
          const si = (y * tw + x), di = (cy * cropW + cx)

          let wx = 1.0, wy = 1.0
          const HALF = OVERLAP / 2
          if (left > 0 && x < OVERLAP) wx = Math.min(1.0, x / HALF)
          if (left + tw < cropW && x > tw - OVERLAP) wx = Math.min(1.0, (tw - 1 - x) / HALF)
          if (top > 0 && y < OVERLAP) wy = Math.min(1.0, y / HALF)
          if (top + th < cropH && y > th - OVERLAP) wy = Math.min(1.0, (th - 1 - y) / HALF)
          const w = wx * wy

          acc[di * 3] += tilePx[si * 3] * w
          acc[di * 3 + 1] += tilePx[si * 3 + 1] * w
          acc[di * 3 + 2] += tilePx[si * 3 + 2] * w
          weightSum[di] += w
        }
      }

      await new Promise(r => setImmediate(r))
    }
  }

  const total = cropW * cropH
  const merged = new Uint8Array(total * 3)
  for (let i = 0; i < total; i++) {
    const w = weightSum[i] || 1
    merged[i * 3] = Math.round(Math.max(0, Math.min(255, acc[i * 3] / w)))
    merged[i * 3 + 1] = Math.round(Math.max(0, Math.min(255, acc[i * 3 + 1] / w)))
    merged[i * 3 + 2] = Math.round(Math.max(0, Math.min(255, acc[i * 3 + 2] / w)))
  }

  return sharp(merged, { raw: { width: cropW, height: cropH, channels: 3 } }).png().toBuffer()
}

parentPort?.on('message', async (msg: { id: number; imageBuffer: ArrayBuffer; maskBuffer: ArrayBuffer }) => {
  const { id, imageBuffer, maskBuffer } = msg
  try {
    const fullImgBuf = Buffer.from(imageBuffer)
    const fullMaskBuf = Buffer.from(maskBuffer)

    const bbox = await computeMaskBbox(fullMaskBuf)
    if (!bbox.hasMask) {
      parentPort?.postMessage({ id, success: true, patchBuffer: fullImgBuf.buffer, patchX: 0, patchY: 0, patchWidth: 0, patchHeight: 0 })
      return
    }

    const paddedBbox = padBbox(
      { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
      bbox.imgWidth, bbox.imgHeight
    )

    const rectInfo = {
      x: paddedBbox.x, y: paddedBbox.y,
      width: paddedBbox.width, height: paddedBbox.height,
    }

    console.log(`[LaMa Worker] Crop: ${rectInfo.width}×${rectInfo.height} at (${rectInfo.x},${rectInfo.y})`)

    const cropImgBuf = await sharp(fullImgBuf)
      .extract({ left: rectInfo.x, top: rectInfo.y, width: rectInfo.width, height: rectInfo.height })
      .png().toBuffer()
    const cropMaskBuf = await sharp(fullMaskBuf)
      .extract({ left: rectInfo.x, top: rectInfo.y, width: rectInfo.width, height: rectInfo.height })
      .png().toBuffer()

    const session = await getSession()
    const inputNames = session.inputNames
    const outputNames = session.outputNames
    const imgInputName = inputNames[0]
    const maskInputName = inputNames[1]
    const outName = outputNames[0]

    let restoredAiBuf: Buffer
    if (paddedBbox.width <= 512 && paddedBbox.height <= 512) {
      const { tensor: imageTensor, padInfo } = await prepareImagePatch(cropImgBuf)
      const { tensor: maskTensor } = await prepareMaskPatch(cropMaskBuf)

      console.log('[LaMa Worker] Single-tile inferencing...')
      const results = await session.run({
        [imgInputName]: new ort.Tensor('float32', imageTensor, [1, 3, 512, 512]),
        [maskInputName]: new ort.Tensor('float32', maskTensor, [1, 1, 512, 512]),
      })
      const outputTensor = (results[outName] as ort.Tensor).data as Float32Array
      console.log('[LaMa Worker] Inference done')

      restoredAiBuf = await restorePatch(outputTensor, padInfo, rectInfo.width, rectInfo.height)
    } else {
      restoredAiBuf = await tiledInpaint(
        cropImgBuf, cropMaskBuf,
        rectInfo.width, rectInfo.height,
        session, imgInputName, maskInputName, outName
      )
    }

    const featherMaskBuf = await createFeatherMask(cropMaskBuf)
    const blendedCropBuf = await featherBlend(restoredAiBuf, cropImgBuf, featherMaskBuf)

    parentPort?.postMessage({
      id,
      success: true,
      patchBuffer: blendedCropBuf.buffer,
      patchX: rectInfo.x,
      patchY: rectInfo.y,
      patchWidth: rectInfo.width,
      patchHeight: rectInfo.height,
    })
  } catch (err: any) {
    parentPort?.postMessage({ id, success: false, error: err.message })
  }
})
