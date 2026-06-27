/**
 * 截图功能 — 主进程逻辑
 *
 * 流程：
 *   1. 隐藏主窗口 → desktopCapturer 全屏捕获
 *   2. 创建透明全屏选区窗口，展示截图
 *   3. 用户拖拽选区 → sharp 裁剪
 *   4. 返回结果给主窗口渲染进程
 */
import { BrowserWindow, desktopCapturer, screen, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** 选区窗口引用 */
let selectorWindow: BrowserWindow | null = null
/** 截图原始 Buffer（PNG） */
let capturedImageBuffer: Buffer | null = null

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
  try {
    // 1. 先隐藏主窗口，确保不会出现在截图中
    mainWindow.hide()
    // 等待窗口从桌面合成中完全移除（Windows 上 hide 不是同步的）
    await new Promise((resolve) => setTimeout(resolve, 300))

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
    const rect = await openScreenshotSelector(captureResult.dataUrl, displayBounds)

    // 4. 恢复主窗口
    if (!mainWindow.isDestroyed()) {
      mainWindow.show()
      mainWindow.focus()
    }

    // 5. 用户取消
    if (!rect) {
      capturedImageBuffer = null
      return { success: false, error: '用户取消截图' }
    }

    // 6. 裁剪
    const croppedBuffer = await cropImage(capturedImageBuffer, rect, displayBounds)
    capturedImageBuffer = null

    const dataUrl = `data:image/png;base64,${croppedBuffer.toString('base64')}`
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
 */
async function captureScreen(): Promise<CaptureResult | null> {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.size

  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width, height },
  })

  if (sources.length === 0) return null

  // 优先匹配主显示器对应的源
  const source = sources[0]
  const nativeImage = source.thumbnail
  const buffer = nativeImage.toPNG()
  const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`

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

/**
 * 打开半透明全屏选区窗口，等待用户完成选区
 * @returns 选区矩形，null 表示用户取消
 */
function openScreenshotSelector(
  imageDataUrl: string,
  displayBounds: Electron.Rectangle,
): Promise<SelectionRect | null> {
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

    // 监听选区窗口的 IPC 事件
    const onSelectionMade = (_event: Electron.IpcMainEvent, rect: SelectionRect) => {
      cleanup()
      resolve(rect)
    }

    const onSelectionCancel = () => {
      cleanup()
      resolve(null)
    }

    ipcMain.once('screenshot:selection-made', onSelectionMade)
    ipcMain.once('screenshot:selection-cancel', onSelectionCancel)

    // 窗口关闭也视为取消
    selectorWindow.once('closed', () => {
      cleanup()
      resolve(null)
    })

    function cleanup() {
      ipcMain.removeListener('screenshot:selection-made', onSelectionMade)
      ipcMain.removeListener('screenshot:selection-cancel', onSelectionCancel)
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

// ─── 选区窗口内联 HTML ───

function buildSelectorHTML(
  _imageDataUrl: string,
  displayBounds: Electron.Rectangle,
): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; }
  body { background: transparent; user-select: none; }
  #canvas { display: block; position: absolute; top: 0; left: 0; }

  /* 提示文字 */
  #hint {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: rgba(0,0,0,0.55);
    padding: 6px 16px;
    border-radius: 12px;
    pointer-events: none;
    z-index: 10;
    backdrop-filter: blur(8px);
  }

  /* 尺寸标签 */
  #size-label {
    position: fixed;
    color: #fff;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: rgba(0,0,0,0.65);
    padding: 3px 8px;
    border-radius: 6px;
    pointer-events: none;
    display: none;
    z-index: 10;
  }
</style>
</head>
<body>
  <div id="hint">拖拽鼠标框选截图区域 / 按 ESC 取消 / 按 Enter 确认</div>
  <div id="size-label"></div>
  <canvas id="canvas"></canvas>
  <script>
    (function() {
      // 通过 preload 暴露的 selectorApis 与主进程通信
      var canvas = document.getElementById('canvas')
      var ctx = canvas.getContext('2d')
      var hintEl = document.getElementById('hint')
      var sizeLabel = document.getElementById('size-label')

      var w = ${displayBounds.width}
      var h = ${displayBounds.height}
      canvas.width = w
      canvas.height = h

      var img = null
      var isDrawing = false
      var startX = 0, startY = 0
      var selX = 0, selY = 0, selW = 0, selH = 0

      // ─── 接收图片数据 ───
      window.selectorApis.onImageData(function(dataUrl) {
        img = new Image()
        img.onload = function() {
          ctx.drawImage(img, 0, 0, w, h)
          drawOverlay()
        }
        img.src = dataUrl
      })

      // ─── 绘制半透明遮罩 + 选区 ───
      function drawOverlay() {
        ctx.clearRect(0, 0, w, h)
        // 重绘原图
        if (img) ctx.drawImage(img, 0, 0, w, h)

        // 半透明遮罩
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
        ctx.fillRect(0, 0, w, h)

        // 选区"挖空"（显示原图）
        if (selW > 0 && selH > 0) {
          // 方案：用 globalCompositeOperation 挖洞
          ctx.save()
          ctx.globalCompositeOperation = 'destination-out'
          ctx.fillStyle = 'rgba(255,255,255,1)'
          ctx.fillRect(selX, selY, selW, selH)
          ctx.restore()

          // 重绘选区内的原图
          ctx.save()
          ctx.beginPath()
          ctx.rect(selX, selY, selW, selH)
          ctx.clip()
          if (img) ctx.drawImage(img, 0, 0, w, h)
          ctx.restore()

          // 选区边框（虚线/实线）
          ctx.strokeStyle = '#1890ff'
          ctx.lineWidth = 2
          ctx.setLineDash([6, 3])
          ctx.strokeRect(selX + 1, selY + 1, selW - 2, selH - 2)
          ctx.setLineDash([])

          // 四角高亮
          const cornerLen = 10
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 2
          // 左上角
          ctx.beginPath()
          ctx.moveTo(selX, selY + cornerLen)
          ctx.lineTo(selX, selY)
          ctx.lineTo(selX + cornerLen, selY)
          ctx.stroke()
          // 右上角
          ctx.beginPath()
          ctx.moveTo(selX + selW - cornerLen, selY)
          ctx.lineTo(selX + selW, selY)
          ctx.lineTo(selX + selW, selY + cornerLen)
          ctx.stroke()
          // 左下角
          ctx.beginPath()
          ctx.moveTo(selX, selY + selH - cornerLen)
          ctx.lineTo(selX, selY + selH)
          ctx.lineTo(selX + cornerLen, selY + selH)
          ctx.stroke()
          // 右下角
          ctx.beginPath()
          ctx.moveTo(selX + selW - cornerLen, selY + selH)
          ctx.lineTo(selX + selW, selY + selH)
          ctx.lineTo(selX + selW, selY + selH - cornerLen)
          ctx.stroke()

          // 更新尺寸标签
          sizeLabel.style.display = 'block'
          const labelX = selX + selW + 8 > w - 100 ? selX - 80 : selX + selW + 8
          const labelY = selY + selH + 8 > h - 30 ? selY + selH - 30 : selY + selH + 8
          sizeLabel.style.left = labelX + 'px'
          sizeLabel.style.top = labelY + 'px'
          sizeLabel.textContent = Math.round(selW) + ' × ' + Math.round(selH)
        } else {
          sizeLabel.style.display = 'none'
        }
      }

      // ─── 鼠标事件 ───
      canvas.addEventListener('mousedown', function(e) {
        isDrawing = true
        startX = e.clientX
        startY = e.clientY
        selX = startX
        selY = startY
        selW = 0
        selH = 0
        hintEl.style.display = 'none'
      })

      canvas.addEventListener('mousemove', function(e) {
        if (!isDrawing) return
        const mx = e.clientX
        const my = e.clientY
        selX = Math.min(startX, mx)
        selY = Math.min(startY, my)
        selW = Math.abs(mx - startX)
        selH = Math.abs(my - startY)
        drawOverlay()
      })

      canvas.addEventListener('mouseup', function() {
        if (!isDrawing) return
        isDrawing = false
        // 选区太小（< 5px）视为无效
        if (selW < 5 || selH < 5) {
          selW = 0
          selH = 0
          drawOverlay()
          hintEl.style.display = 'block'
        }
      })

      // ─── 键盘事件 ───
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          window.selectorApis.cancelSelection()
        } else if (e.key === 'Enter') {
          if (selW >= 5 && selH >= 5) {
            window.selectorApis.submitSelection({
              x: selX,
              y: selY,
              width: selW,
              height: selH,
            })
          }
        }
      })

      // 双击选区确认
      canvas.addEventListener('dblclick', function() {
        if (selW >= 5 && selH >= 5) {
          window.selectorApis.submitSelection({
            x: selX,
            y: selY,
            width: selW,
            height: selH,
          })
        }
      })
    })()
  </script>
</body>
</html>`
}
