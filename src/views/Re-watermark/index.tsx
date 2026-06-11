import { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Slider, Radio, Upload, message, Spin, Space, Tooltip } from 'antd'
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ScissorOutlined,
  UndoOutlined,
  ClearOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { loadOpenCV, isCVReady } from '@/utils/opencv-loader'
import {
  inpaintImage,
  loadImageFromFile,
  renderImageDataToCanvas,
  canvasToBlob,
} from '@/utils/inpaint'
import type { UploadFile } from 'antd'
import './index.less'

/** 选区矩形 */
interface SelectionRect {
  id: number
  x: number
  y: number
  width: number
  height: number
}

/** 修复算法选项 */
const ALGORITHM_OPTIONS = [
  { label: 'Telea（快速，推荐）', value: 'telea' },
  { label: 'Navier-Stokes（高质量）', value: 'ns' },
]

export default function ReWatermark() {
  // --- 状态 ---
  const [cvLoading, setCvLoading] = useState(true)
  const [cvError, setCvError] = useState('')
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [rects, setRects] = useState<SelectionRect[]>([])
  const [rectsHistory, setRectsHistory] = useState<SelectionRect[][]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultImageData, setResultImageData] = useState<ImageData | null>(null)
  const [inpaintRadius, setInpaintRadius] = useState(5)
  const [algorithm, setAlgorithm] = useState<'telea' | 'ns'>('telea')
  const [viewMode, setViewMode] = useState<'before' | 'after'>('before')

  // --- Refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rectIdCounter = useRef(0)

  // 图片在 canvas 上的显示参数
  const displayParams = useRef({ scale: 1, offsetX: 0, offsetY: 0, imgW: 0, imgH: 0 })

  // --- 初始化 OpenCV ---
  useEffect(() => {
    setCvLoading(true)
    loadOpenCV()
      .then(() => {
        setCvLoading(false)
        console.log('[Re-watermark] OpenCV 就绪')
      })
      .catch((err) => {
        setCvLoading(false)
        setCvError(`OpenCV 加载失败: ${err.message}`)
        console.error(err)
      })
  }, [])

  // --- 绘制所有已确认的选区 ---
  const drawAllRects = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { scale, offsetX, offsetY } = displayParams.current
      for (const r of rects) {
        const dx = r.x * scale + offsetX
        const dy = r.y * scale + offsetY
        const dw = r.width * scale
        const dh = r.height * scale

        ctx.strokeStyle = '#ff4d4f'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 3])
        ctx.strokeRect(dx, dy, dw, dh)

        // 半透明填充
        ctx.fillStyle = 'rgba(255, 77, 79, 0.15)'
        ctx.fillRect(dx, dy, dw, dh)
        ctx.setLineDash([])
      }
    },
    [rects]
  )

  // --- 将源图绘制到 Canvas ---
  //     showRects=false 时只绘制原图，不叠加选区（用于修复后的「原图」对比模式）
  const drawImageToCanvas = useCallback((showRects = true) => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !sourceImage) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 计算适合容器的显示尺寸
    const maxW = container.clientWidth - 32
    const maxH = container.clientHeight - 32
    const imgW = sourceImage.naturalWidth
    const imgH = sourceImage.naturalHeight

    const scaleW = maxW / imgW
    const scaleH = maxH / imgH
    const scale = Math.min(scaleW, scaleH, 1) // 不超过原图大小

    const displayW = Math.floor(imgW * scale)
    const displayH = Math.floor(imgH * scale)
    const offsetX = Math.floor((maxW - displayW) / 2)
    const offsetY = Math.floor((maxH - displayH) / 2)

    canvas.width = maxW
    canvas.height = maxH

    // 清空并绘制原图
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(sourceImage, offsetX, offsetY, displayW, displayH)

    // 保存显示参数
    displayParams.current = { scale, offsetX, offsetY, imgW, imgH }

    if (showRects) {
      // 叠加已有选区
      drawAllRects(ctx)
      // 叠加正在拖拽的临时选区
      if (isDrawing && drawStart && drawCurrent) {
        drawTempRect(ctx, drawStart, drawCurrent)
      }
    }
  }, [sourceImage, isDrawing, drawStart, drawCurrent, drawAllRects])



  // --- 绘制正在拖拽的临时选区 ---
  const drawTempRect = (ctx: CanvasRenderingContext2D, start: { x: number; y: number }, current: { x: number; y: number }) => {
    const x = Math.min(start.x, current.x)
    const y = Math.min(start.y, current.y)
    const w = Math.abs(current.x - start.x)
    const h = Math.abs(current.y - start.y)

    ctx.strokeStyle = '#1677ff'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 3])
    ctx.strokeRect(x, y, w, h)
    ctx.fillStyle = 'rgba(22, 119, 255, 0.1)'
    ctx.fillRect(x, y, w, h)
    ctx.setLineDash([])
  }

  // --- 依赖变更时重绘 ---
  //    修复完成后（resultImageData 存在）点击「原图」→ 展示干净原图，不叠加选区
  useEffect(() => {
    if (sourceImage && imageLoaded && viewMode === 'before') {
      const showRects = !resultImageData
      drawImageToCanvas(showRects)
    }
  }, [sourceImage, imageLoaded, rects, isDrawing, drawStart, drawCurrent, drawImageToCanvas, viewMode, resultImageData])

  // --- 渲染结果图（与编辑区使用相同的显示尺寸）---
  useEffect(() => {
    if (resultImageData && resultCanvasRef.current && containerRef.current) {
      const container = containerRef.current
      const maxW = container.clientWidth - 32
      const maxH = container.clientHeight - 32
      const scale = Math.min(maxW / resultImageData.width, maxH / resultImageData.height, 1)
      const displayW = Math.floor(resultImageData.width * scale)
      const displayH = Math.floor(resultImageData.height * scale)
      renderImageDataToCanvas(resultCanvasRef.current, resultImageData, displayW, displayH)
    }
  }, [resultImageData, viewMode])

  // --- 上传图片 ---
  const handleFileChange = useCallback(async (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[0]?.originFileObj
    if (!file) return
    // 校验类型
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      message.error('请上传 PNG / JPEG / WebP / BMP 格式的图片')
      return
    }

    // 校验大小（最大 50MB）
    if (file.size > 50 * 1024 * 1024) {
      message.error('图片大小不能超过 50MB')
      return
    }

    try {
      const img = await loadImageFromFile(file)
      setSourceImage(img)
      setImageLoaded(true)
      setRects([])
      setRectsHistory([])
      setResultImageData(null)
      setViewMode('before')
      message.success('图片加载成功，请在图片上框选水印区域')
    } catch {
      message.error('图片加载失败，请重试')
    }
  }, [])

  // --- Canvas 鼠标事件 ---
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!sourceImage || isProcessing) return
    const coords = getCanvasCoords(e)
    setDrawStart(coords)
    setDrawCurrent(coords)
    setIsDrawing(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart) return
    const coords = getCanvasCoords(e)
    setDrawCurrent(coords)
  }

  const handleMouseUp = () => {
    if (!isDrawing || !drawStart || !drawCurrent) {
      setIsDrawing(false)
      setDrawStart(null)
      setDrawCurrent(null)
      return
    }

    // 将画布坐标转换为图片坐标
    const { scale, offsetX, offsetY } = displayParams.current

    const cx1 = Math.min(drawStart.x, drawCurrent.x)
    const cy1 = Math.min(drawStart.y, drawCurrent.y)
    const cx2 = Math.max(drawStart.x, drawCurrent.x)
    const cy2 = Math.max(drawStart.y, drawCurrent.y)

    const imgX = Math.round((cx1 - offsetX) / scale)
    const imgY = Math.round((cy1 - offsetY) / scale)
    const imgW = Math.round(((cx2 - cx1) / scale))
    const imgH = Math.round(((cy2 - cy1) / scale))

    setIsDrawing(false)
    setDrawStart(null)
    setDrawCurrent(null)

    // 太小的选区忽略（可能是误点击）
    if (imgW < 5 || imgH < 5) return

    const newRect: SelectionRect = {
      id: rectIdCounter.current++,
      x: Math.max(0, imgX),
      y: Math.max(0, imgY),
      width: imgW,
      height: imgH,
    }

    // 保存当前状态到历史，再追加新选区
    pushHistory(rects)
    setRects((prev) => [...prev, newRect])
  }

  // --- 保存当前选区到历史栈 ---
  const pushHistory = useCallback((currentRects: SelectionRect[]) => {
    setRectsHistory((prev) => [...prev, currentRects])
  }, [])

  // --- 删除指定选区 ---
  const removeRect = (id: number) => {
    pushHistory(rects) // 保存删除前的状态（rects 是当前渲染周期的值）
    setRects((prev) => prev.filter((r) => r.id !== id))
    setResultImageData(null)
    setViewMode('before')
  }

  // --- 清空所有选区 ---
  const clearAllRects = () => {
    if (rects.length === 0) return
    pushHistory(rects) // 保存清空前的状态
    setRects([])
    setResultImageData(null)
    setViewMode('before')
  }

  // --- 撤销：恢复到上一次操作前的状态 ---
  const undoLastRect = () => {
    if (rectsHistory.length === 0) return
    // 栈顶保存的是「上一步操作前」的状态，直接恢复
    const lastState = rectsHistory[rectsHistory.length - 1]
    setRects(lastState)
    setRectsHistory((prev) => prev.slice(0, -1))
    setResultImageData(null)
    setViewMode('before')
  }

  // --- 执行去水印 ---
  const handleRemoveWatermark = async () => {
    if (!sourceImage || rects.length === 0) {
      message.warning('请先框选水印区域')
      return
    }
    if (!isCVReady()) {
      message.error('OpenCV 尚未就绪，请等待加载完成')
      return
    }

    setIsProcessing(true)
    try {
      const result = await inpaintImage(sourceImage, rects, {
        inpaintRadius,
        algorithm,
      })
      setResultImageData(result)
      setViewMode('after')
      message.success('水印去除完成！')
    } catch (err: any) {
      message.error(`处理失败: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // --- 下载结果 ---
  const handleDownload = async () => {
    if (!resultCanvasRef.current) return
    try {
      const blob = await canvasToBlob(resultCanvasRef.current, 'image/png')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `watermark-removed-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      message.success('下载成功')
    } catch {
      message.error('下载失败')
    }
  }

  // --- 重置 ---
  const handleReset = () => {
    setSourceImage(null)
    setImageLoaded(false)
    setRects([])
    setRectsHistory([])
    setResultImageData(null)
    setViewMode('before')
  }

  // --- 加载中 ---
  if (cvLoading) {
    return (
      <div className="re-watermark">
        <div className="rw-loading">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p>正在加载 OpenCV 引擎...</p>
        </div>
      </div>
    )
  }

  // --- 加载失败 ---
  if (cvError) {
    return (
      <div className="re-watermark">
        <div className="rw-error">
          <p>引擎加载失败</p>
          <p className="rw-error-detail">{cvError}</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            重新加载
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="re-watermark">
      {/* 顶部工具栏 */}
      <div className="rw-toolbar">
        <Space size="middle" wrap>
          <Upload
            accept="image/png,image/jpeg,image/webp,image/bmp"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button type="primary" icon={<UploadOutlined />} disabled={isProcessing}>
              上传图片
            </Button>
          </Upload>

          {sourceImage && (
            <>
              <Tooltip title="撤销上一次操作">
                <Button
                  icon={<UndoOutlined />}
                  onClick={undoLastRect}
                  disabled={rectsHistory.length === 0 || isProcessing || !!resultImageData}
                >
                  撤销
                </Button>
              </Tooltip>
              <Tooltip title="清空所有选区">
                <Button icon={<ClearOutlined />} onClick={clearAllRects} disabled={rects.length === 0 || isProcessing || !!resultImageData}>
                  清空
                </Button>
              </Tooltip>
              <Button
                type="primary"
                icon={isProcessing ? <LoadingOutlined /> : <ScissorOutlined />}
                onClick={handleRemoveWatermark}
                disabled={rects.length === 0 || isProcessing || !!resultImageData}
                loading={isProcessing}
                danger
              >
                {isProcessing ? '处理中...' : '去除水印'}
              </Button>
            </>
          )}

          {resultImageData && (
            <>
              <Space.Compact>
                <Button type={viewMode === 'before' ? 'primary' : 'default'} onClick={() => setViewMode('before')}>
                  原图
                </Button>
                <Button type={viewMode === 'after' ? 'primary' : 'default'} onClick={() => setViewMode('after')}>
                  结果
                </Button>
              </Space.Compact>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                下载结果
              </Button>
            </>
          )}

          {sourceImage && (
            <Button icon={<DeleteOutlined />} onClick={handleReset} disabled={isProcessing}>
              重置
            </Button>
          )}
        </Space>
      </div>

      {/* 参数设置 */}
      {sourceImage && (
        <div className="rw-settings">
          <Space size="large" wrap>
            <div className="rw-setting-item">
              <Tooltip title="修复时从水印周围多大范围内采样填充。值越小越精细，值越大越平滑但可能模糊细节" placement='right'>
                <span className="rw-setting-label">修复半径: {inpaintRadius}px</span>
              </Tooltip>
              <Slider
                min={1}
                max={15}
                value={inpaintRadius}
                onChange={setInpaintRadius}
                disabled={isProcessing || !!resultImageData}
                style={{ width: 150 }}
              />
            </div>
            <div className="rw-setting-item">
              <span className="rw-setting-label">修复算法:</span>
              <Radio.Group
                options={ALGORITHM_OPTIONS}
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={isProcessing || !!resultImageData}
              />
            </div>
          </Space>
        </div>
      )}

      {/* 选区列表（修复完成后隐藏） */}
      {rects.length > 0 && !resultImageData && (
        <div className="rw-rect-list">
          <span className="rw-rect-label">已选区域 ({rects.length}):</span>
          {rects.map((r) => (
            <span key={r.id} className="rw-rect-tag">
              [{r.x}, {r.y}, {r.width}×{r.height}]
              <DeleteOutlined className="rw-rect-delete" onClick={() => removeRect(r.id)} />
            </span>
          ))}
        </div>
      )}

      {/* 图片编辑区 */}
      <div className="rw-workspace" ref={containerRef}>
        {!sourceImage ? (
          <div className="rw-upload-hint">
            <Upload
              accept="image/png,image/jpeg,image/webp,image/bmp"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <div className="rw-drop-zone">
                <UploadOutlined style={{ fontSize: 48, color: '#bbb' }} />
                <p>点击或拖拽图片到此处</p>
                <p className="rw-drop-sub">支持 PNG / JPEG / WebP / BMP，最大 50MB</p>
              </div>
            </Upload>
          </div>
        ) : (
          <>
            {/* 原图编辑区 — 始终挂载，通过 display 控制显隐 */}
            <canvas
              ref={canvasRef}
              className="rw-canvas"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                display: viewMode === 'before' ? 'block' : 'none',
                cursor: isProcessing ? 'wait' : 'crosshair',
              }}
            />

            {/* 结果预览区 — 始终挂载，通过 display 控制显隐 */}
            <div
              className="rw-result-container"
              style={{ display: viewMode === 'after' ? 'inline-block' : 'none' }}
            >
              <canvas ref={resultCanvasRef} className="rw-canvas rw-result-canvas" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
