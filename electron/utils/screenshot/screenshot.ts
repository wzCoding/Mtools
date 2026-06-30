/**
 * 截图功能 — 主进程逻辑
 *
 * 流程：
 *   1. 隐藏主窗口 → desktopCapturer 全屏捕获
 *   2. 创建透明全屏选区窗口，展示截图
 *   3. 用户拖拽选区 → sharp 裁剪
 *   4. 返回结果给主窗口渲染进程
 */
import { BrowserWindow, desktopCapturer, screen, ipcMain, nativeImage } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import selectorHtmlTemplate from './screenshot.html?raw'
import pinnedBoxTemplate from './pinnedbox.html?raw'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** 选区窗口引用 */
let selectorWindow: BrowserWindow | null = null
/** 截图原始 Buffer（PNG） */
let capturedImageBuffer: Buffer | null = null
/** 并发锁：防止多次触发创建多个选区窗口 */
let isCapturing = false

// ─── 公共 API：供 IPC 调用 ───

/**
 * 启动截图流程
 * @param mainWindow 主窗口（用于隐藏/恢复）
 * @returns 裁剪后的图片 Data URL，若用户取消则返回 null
 */
export async function startScreenshot(mainWindow: BrowserWindow): Promise<{
  success: boolean
  dataUrl?: string
  error?: string
}> {
  // 并发锁：如果已有截屏流程在进行中，直接拒绝
  if (isCapturing) {
    console.warn('[Screenshot] 截图已在进行中，忽略重复触发')
    return { success: false, error: '截图进行中，请稍后再试' }
  }

  // 安全清理：如果上次异常退出留有残留选区窗口，先销毁
  if (selectorWindow && !selectorWindow.isDestroyed()) {
    console.warn('[Screenshot] 发现残留选区窗口，强制清理')
    try { selectorWindow.close() } catch { /* 忽略 */ }
    selectorWindow = null
  }

  isCapturing = true
  try {
    // 1. 隐藏主窗口，确保不会出现在截图中
    mainWindow.hide()
    // 等待 DWM 合成完成（150ms 足够，已验证）
    await new Promise((resolve) => setTimeout(resolve, 150))

    // 2. 捕获屏幕
    const captureResult = await captureScreen()

    if (!captureResult) {
      // 恢复主窗口
      if (!mainWindow.isDestroyed()) {
        mainWindow.show()
        mainWindow.focus()
      }
      return { success: false, error: '无法捕获屏幕' }
    }

    capturedImageBuffer = captureResult.buffer
    const displayBounds = captureResult.bounds

    // 3. 打开选区窗口
    const selectionResult = await openScreenshotSelector(captureResult.dataUrl, displayBounds)

    // 4. 恢复主窗口
    if (!mainWindow.isDestroyed()) {
      mainWindow.show()
      mainWindow.focus()
    }

    // 5. 用户取消
    if (!selectionResult) {
      capturedImageBuffer = null
      return { success: false, error: '用户取消截图' }
    }

    // 6. 获取最终图片
    let dataUrl: string
    if (selectionResult.compositedDataUrl) {
      // 用户在选区窗口做了标注 → 直接使用浏览器合成的图片
      dataUrl = selectionResult.compositedDataUrl
    } else {
      // 无标注 → sharp 裁剪
      const croppedBuffer = await cropImage(capturedImageBuffer, selectionResult.rect, displayBounds)
      dataUrl = `data:image/png;base64,${croppedBuffer.toString('base64')}`
    }
    capturedImageBuffer = null

    return { success: true, dataUrl }
  } catch (err) {
    capturedImageBuffer = null
    // 确保主窗口恢复（即使截图过程抛异常）
    if (!mainWindow.isDestroyed()) {
      mainWindow.show()
      mainWindow.focus()
    }
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  } finally {
    isCapturing = false
  }
}

// ─── 内部实现 ───

interface CaptureResult {
  buffer: Buffer
  dataUrl: string
  bounds: Electron.Rectangle
}

/**
 * 使用 desktopCapturer 捕获主屏幕
 *
 * 优化策略：
 *  - 缩略图最长边限制 1920px（大幅降低 4K 屏捕获耗时）
 *  - 选区预览用 JPEG（编码快 + 体积小，IPC 传输迅速）
 *  - 保留完整 PNG 缓冲用于 sharp 无损裁剪
 */
async function captureScreen(): Promise<CaptureResult | null> {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.size

  // 缩略图最长边 ≤ 1920px，4K 屏从 3840 → 1920，捕获耗时降低 ~60%
  const MAX_THUMB_DIM = 1920
  const thumbScale = Math.min(1, MAX_THUMB_DIM / Math.max(width, height))
  const thumbWidth = Math.round(width * thumbScale)
  const thumbHeight = Math.round(height * thumbScale)

  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: thumbWidth, height: thumbHeight },
  })

  if (sources.length === 0) return null

  const source = sources[0]
  const nativeImage = source.thumbnail

  // PNG 缓冲：供 sharp 无损裁剪使用
  const buffer = nativeImage.toPNG()
  // JPEG 预览：编码快 8 倍，体积小 5-10 倍，选区窗口 IPC 传输极快
  const jpegBuffer = nativeImage.toJPEG(85)
  const dataUrl = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`

  return {
    buffer,
    dataUrl,
    bounds: { x: 0, y: 0, width, height },
  }
}

interface SelectionRect {
  x: number
  y: number
  width: number
  height: number
}

/** 选区窗口的返回结果 */
interface SelectionResult {
  rect: SelectionRect
  /** 若用户在选区窗口做了标注，则为合成后的裁剪图 data URL */
  compositedDataUrl?: string
}

/** ─── 选区窗口 ─── */
function openScreenshotSelector(
  imageDataUrl: string,
  displayBounds: Electron.Rectangle,
): Promise<SelectionResult | null> {
  return new Promise((resolve) => {
    const preloadPath = path.join(__dirname, '../preload/screenshot-selector.js')

    selectorWindow = new BrowserWindow({
      x: displayBounds.x,
      y: displayBounds.y,
      width: displayBounds.width,
      height: displayBounds.height,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      fullscreenable: false,
      // macOS 上隐藏窗口按钮
      ...(process.platform === 'darwin' ? {
        titleBarStyle: 'hidden',
        hiddenInMissionControl: true,
      } : {}),
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
      },
    })

    // 加载内联 HTML
    const html = buildSelectorHTML(imageDataUrl, displayBounds)
    selectorWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

    // 选区窗口准备就绪后发送图片数据
    selectorWindow.webContents.on('did-finish-load', () => {
      selectorWindow?.webContents.send('screenshot:image-data', imageDataUrl)
    })

    // 监听选区窗口的 IPC 事件（第二个参数为可选合成图片 data URL）
    const onSelectionMade = (_event: Electron.IpcMainEvent, rect: SelectionRect, compositedDataUrl?: string) => {
      cleanup()
      resolve({ rect, compositedDataUrl })
    }

    const onSelectionCancel = () => {
      cleanup()
      resolve(null)
    }

    ipcMain.once('screenshot:selection-made', onSelectionMade)
    ipcMain.once('screenshot:selection-cancel', onSelectionCancel)

    // 监听"钉住截图"
    const onPinImage = (_event: Electron.IpcMainEvent, dataUrl: string) => {
      createPinnedWindow(dataUrl)
      // 关闭选区窗口，不向主应用返回截图结果
      cleanup()
      resolve(null)
    }
    ipcMain.once('screenshot:pin-image', onPinImage)

    // 窗口关闭也视为取消
    selectorWindow.once('closed', () => {
      cleanup()
      resolve(null)
    })

    function cleanup() {
      ipcMain.removeListener('screenshot:selection-made', onSelectionMade)
      ipcMain.removeListener('screenshot:selection-cancel', onSelectionCancel)
      ipcMain.removeListener('screenshot:pin-image', onPinImage)
      if (selectorWindow && !selectorWindow.isDestroyed()) {
        selectorWindow.close()
      }
      selectorWindow = null
    }
  })
}

/**
 * 使用 sharp 裁剪图片
 * @param buffer 原始 PNG Buffer
 * @param rect 选区（相对于显示器的像素坐标）
 * @param displayBounds 显示器边界（用于计算缩放比例）
 */
async function cropImage(
  buffer: Buffer,
  rect: SelectionRect,
  displayBounds: Electron.Rectangle,
): Promise<Buffer> {
  // desktopCapturer 的 thumbnailSize 可能与显示器物理分辨率不同
  // 需要计算缩放比例
  const metadata = await sharp(buffer).metadata()
  const imageWidth = metadata.width ?? displayBounds.width
  const imageHeight = metadata.height ?? displayBounds.height

  const scaleX = imageWidth / displayBounds.width
  const scaleY = imageHeight / displayBounds.height

  const left = Math.round(rect.x * scaleX)
  const top = Math.round(rect.y * scaleY)
  const width = Math.round(rect.width * scaleX)
  const height = Math.round(rect.height * scaleY)

  return sharp(buffer)
    .extract({ left, top, width, height })
    .png()
    .toBuffer()
}

function createPinnedWindow(dataUrl: string): void {
  const img = nativeImage.createFromDataURL(dataUrl)
  const imgSize = img.getSize()

  // 钉图窗口最大尺寸：长边 ≤ 600px，全屏截图也不会覆盖桌面
  const MAX_DIM = 600
  let winW = imgSize.width
  let winH = imgSize.height

  if (winW > MAX_DIM || winH > MAX_DIM) {
    const scale = Math.min(MAX_DIM / winW, MAX_DIM / winH)
    winW = Math.round(winW * scale)
    winH = Math.round(winH * scale)
  }

  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize

  const pinnedWin = new BrowserWindow({
    width: winW,
    height: winH,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  pinnedWin.setPosition(Math.round((sw - winW) / 2), Math.round((sh - winH) / 2))

  pinnedWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(
    pinnedBoxTemplate.replace('__IMAGE_URL__', dataUrl)
  )}`)
}

// ─── 选区窗口 HTML 模板 ───
// 模板文件位于 ./screenshot/screenshot.html，通过 Vite ?raw 导入
// 占位符 __WIDTH__ / __HEIGHT__ 在运行时替换为实际屏幕尺寸

function buildSelectorHTML(
  _imageDataUrl: string,
  displayBounds: Electron.Rectangle,
): string {
  return selectorHtmlTemplate
    .replace('__WIDTH__', String(displayBounds.width))
    .replace('__HEIGHT__', String(displayBounds.height))
}
