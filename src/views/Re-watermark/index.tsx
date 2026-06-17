import { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Slider, Radio, Upload, message, Spin, Space, Tooltip, Segmented, Modal } from 'antd'
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ScissorOutlined,
  UndoOutlined,
  ClearOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import { loadOpenCV, isCVReady } from '@/utils/opencv-loader'
import {
  inpaintImage,
  loadImageFromFile,
  renderImageDataToCanvas,
  canvasToBlob,
} from '@/utils/inpaint'
import type { UploadFile } from 'antd'
import KonvaCanvas, { type KonvaCanvasRef } from '@/components/KonvaCanvas'
import { ProcessingOverlay } from '@/components/ProcessingOverlay'
import './index.less'

/** 修复算法选项 */
const ALGORITHM_OPTIONS = [
  { label: `Telea（${$t('Telea')}）`, value: 'telea' },
  { label: `Navier-Stokes（${$t('Navier-Stokes')}）`, value: 'ns' },
]

/** 选区矩形 */
interface SelectionRect {
  id: number
  x: number
  y: number
  width: number
  height: number
}

export default function ReWatermark() {

  const { t: $t } = useTranslation()

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
  const [repairMode, setRepairMode] = useState<'fast' | 'quality'>('fast')
  const [brushSize, setBrushSize] = useState(20)
  const [hasKonvaStrokes, setHasKonvaStrokes] = useState(false)
  const [workspaceSize, setWorkspaceSize] = useState({ w: 800, h: 500 })
  const [patchImage, setPatchImage] = useState<HTMLImageElement | null>(null)
  const [patchRect, setPatchRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [processingProgress, setProcessingProgress] = useState<number | undefined>(undefined)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rectIdCounter = useRef(0)
  const konvaRef = useRef<KonvaCanvasRef>(null)

  // 图片在 canvas 上的显示参数
  const displayParams = useRef({ scale: 1, offsetX: 0, offsetY: 0, imgW: 0, imgH: 0 })

  // --- 监听容器尺寸变化（仅在真正 resize 时更新，避免渲染抖动）---
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const updateSize = () => {
      setWorkspaceSize({ w: container.clientWidth, h: container.clientHeight })
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

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

    // 使用缓存的尺寸，避免渲染抖动
    const maxW = workspaceSize.w - 32
    const maxH = workspaceSize.h - 32
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
  }, [sourceImage, isDrawing, drawStart, drawCurrent, drawAllRects, workspaceSize])



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
    if (!sourceImage || !imageLoaded) return

    if (viewMode === 'before') {
      const showRects = repairMode === 'quality' ? !patchImage : !resultImageData
      drawImageToCanvas(showRects)
    }
  }, [sourceImage, imageLoaded, viewMode, repairMode, patchImage, resultImageData, rects, isDrawing, drawStart, drawCurrent, drawImageToCanvas])

  // --- 渲染结果图（与编辑区使用相同的显示尺寸）---
  useEffect(() => {
    if (!resultCanvasRef.current) return

    const maxW = workspaceSize.w - 32
    const maxH = workspaceSize.h - 32

    if (resultImageData && viewMode === 'after') {
      const scale = Math.min(maxW / resultImageData.width, maxH / resultImageData.height, 1)
      const displayW = Math.floor(resultImageData.width * scale)
      const displayH = Math.floor(resultImageData.height * scale)
      renderImageDataToCanvas(resultCanvasRef.current, resultImageData, displayW, displayH)
    }
  }, [resultImageData, viewMode, workspaceSize])

  useEffect(() => {
    if (!patchImage || !patchRect || !canvasRef.current || !sourceImage) return
    if (repairMode !== 'quality' || viewMode !== 'after') return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!container) return

    const maxW = workspaceSize.w - 32
    const maxH = workspaceSize.h - 32
    const imgW = sourceImage.naturalWidth
    const imgH = sourceImage.naturalHeight
    const scale = Math.min(maxW / imgW, maxH / imgH, 1)
    const displayW = Math.floor(imgW * scale)
    const displayH = Math.floor(imgH * scale)
    const offsetX = Math.floor((maxW - displayW) / 2)
    const offsetY = Math.floor((maxH - displayH) / 2)

    canvas.width = maxW
    canvas.height = maxH
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(sourceImage, offsetX, offsetY, displayW, displayH)
    ctx.drawImage(
      patchImage,
      patchRect.x * scale + offsetX,
      patchRect.y * scale + offsetY,
      patchRect.w * scale,
      patchRect.h * scale
    )
    displayParams.current = { scale, offsetX, offsetY, imgW, imgH }
  }, [patchImage, patchRect, viewMode, repairMode, workspaceSize, sourceImage])

  // --- 上传图片 ---
  const handleFileChange = useCallback(async (info: { fileList: UploadFile[] }) => {
    const file = info.fileList[0]?.originFileObj
    if (!file) return
    // 校验类型
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      message.error($t('image-upload-tip'))
      return
    }

    // 校验大小（最大 50MB）
    if (file.size > 50 * 1024 * 1024) {
      message.error($t('image-size-tip'))
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
      konvaRef.current?.clearAll()
      setHasKonvaStrokes(false)
      message.success($t('image-upload-success-tip'))
    } catch {
      message.error($t('fail-load-image'))
    }
  }, [])

  // --- Canvas 鼠标事件 ---
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
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
    if (repairMode === 'quality') {
      konvaRef.current?.clearAll()
      setResultImageData(null)
      setViewMode('before')
      return
    }
    if (rects.length === 0) return
    pushHistory(rects)
    setRects([])
    setResultImageData(null)
    setViewMode('before')
  }

  // --- 撤销：恢复到上一次操作前的状态 ---
  const undoLastRect = () => {
    if (repairMode === 'quality') {
      konvaRef.current?.undoLast()
      setResultImageData(null)
      setViewMode('before')
      return
    }
    if (rectsHistory.length === 0) return
    const lastState = rectsHistory[rectsHistory.length - 1]
    setRects(lastState)
    setRectsHistory((prev) => prev.slice(0, -1))
    setResultImageData(null)
    setViewMode('before')
  }

  // --- 执行去水印（快速模式：OpenCV）---
  const handleRemoveWatermark = async () => {
    if (!sourceImage) {
      message.warning($t('upload-image-first'))
      return
    }
    if (repairMode === 'fast' && rects.length === 0) {
      message.warning($t('select-watermark-first'))
      return
    }
    if (repairMode === 'quality' && !hasKonvaStrokes) {
      message.warning($t('stroke-watermark-first'))
      return
    }

    if (repairMode === 'quality') {
      return handleRemoveWatermarkQuality()
    }

    if (!isCVReady()) {
      message.error($t('opencv-unload'))
      return
    }

    setIsProcessing(true)
    setProcessingProgress(undefined)
    try {
      const result = await inpaintImage(sourceImage, rects, {
        inpaintRadius,
        algorithm,
      })
      setResultImageData(result)
      setViewMode('after')
      message.success(`${$t('remove-watermark-success')}！`)
    } catch (err: any) {
      message.error(`${$t('fail-handle')}: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // --- 执行去水印（高质量模式：LaMa AI）---
  const handleRemoveWatermarkQuality = async () => {
    if (!sourceImage || !konvaRef.current) {
      message.warning($t('stroke-watermark-first'))
      return
    }
    if (!konvaRef.current.hasStrokes()) {
      message.warning($t('stroke-watermark-first'))
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    try {
      // 1. 导出 mask 图
      const maskDataUrl = konvaRef.current.exportMask()
      console.log('[Quality] mask 导出完成, 长度:', maskDataUrl.length)

      const maskResp = await fetch(maskDataUrl)
      const maskBuffer = await maskResp.arrayBuffer()
      // 2. 获取原图 Buffer
      const imgResp = await fetch(sourceImage.src)
      const imageBuffer = await imgResp.arrayBuffer()
      console.log('[Quality] 图片准备完成, 原图:', imageBuffer.byteLength, 'mask:', maskBuffer.byteLength)

      // 3. 检查 bridgeApis 是否可用
      if (!window.bridgeApis?.inpaintLaMa) {
        console.error('[Quality] window.bridgeApis 不可用:', window.bridgeApis)
        throw new Error($t('bridge-apis-unready'))
      }

      // 4. 调用 IPC → 主进程 LaMa 推理
      console.log('[Quality] 开始 IPC 调用...')
      const result = await window.bridgeApis.inpaintLaMa(imageBuffer, maskBuffer)
      console.log('[Quality] IPC 返回:', result.success, result.error || '')

      if (!result.success) {
        throw new Error(result.error || $t('Lama-fail-handle'))
      }

      // 5. 主进程只返回 AI patch + 坐标，渲染进程用 Canvas 拼接原图（非涂抹区零损失）
      const { patchBuffer, patchX, patchY, patchWidth, patchHeight } = result
      console.log('[Quality] patch:', patchWidth, '×', patchHeight, 'at', patchX, ',', patchY)

      const patchBlob = new Blob([patchBuffer], { type: 'image/png' })
      const patchUrl = URL.createObjectURL(patchBlob)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(patchUrl)
        setPatchImage(img)
        setPatchRect({ x: patchX, y: patchY, w: patchWidth, h: patchHeight })
        setViewMode('after')
        setProcessingProgress(100)
        message.success(`${$t('AI-remove-watermark-success')}！`)
        setIsProcessing(false)
      }
      img.onerror = () => {
        URL.revokeObjectURL(patchUrl)
        setProcessingProgress(undefined)
        message.error(`${$t('fail-load-patch')}！`)
        setIsProcessing(false)
      }
      img.src = patchUrl
    } catch (err: any) {
      setProcessingProgress(undefined)
      message.error(`${$t('fail-AI-handle')}: ${err.message}`)
      setIsProcessing(false)
    }
  }

  // --- 下载结果 ---
  const handleDownload = async () => {
    if (repairMode === 'quality' && patchImage && patchRect && sourceImage) {
      const canvas = document.createElement('canvas')
      canvas.width = sourceImage.naturalWidth
      canvas.height = sourceImage.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(sourceImage, 0, 0)
      ctx.drawImage(patchImage, patchRect.x, patchRect.y, patchRect.w, patchRect.h)
      const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/png'))
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `watermark-removed-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        message.success($t('success-download'))
      }
      return
    }

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
      message.success($t('success-download'))
    } catch {
      message.error($t('fail-downlaod'))
    }
  }

  // --- 重置 ---
  const handleReset = () => {
    setSourceImage(null)
    setImageLoaded(false)
    setRects([])
    setRectsHistory([])
    setResultImageData(null)
    setPatchImage(null)
    setPatchRect(null)
    setViewMode('before')
    konvaRef.current?.clearAll()
    setHasKonvaStrokes(false)
  }

  // --- 工作区渲染（避免 JSX 嵌套三元）---
  const renderWorkspace = () => {
    if (!sourceImage) {
      return (
        <div className="rw-upload-hint">
          <Upload
            accept="image/png,image/jpeg,image/webp,image/bmp"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <div className="rw-drop-zone">
              <UploadOutlined style={{ fontSize: 48, color: '#bbb' }} />
              <p>{$t('click-or-drag-image')}</p>
              <p className="rw-drop-sub">{$t('image-tip')}</p>
            </div>
          </Upload>
        </div>
      )
    }

    if (repairMode === 'quality') {
      const maxW = workspaceSize.w - 32
      const maxH = workspaceSize.h - 32
      return (
        <>
          <div style={{ display: viewMode === 'before' ? 'block' : 'none' }}>
            <KonvaCanvas
              ref={konvaRef}
              image={sourceImage}
              containerWidth={maxW}
              containerHeight={maxH}
              disabled={isProcessing}
              brushSize={brushSize}
              onStrokesChange={setHasKonvaStrokes}
            />
          </div>
          <div style={{ display: viewMode === 'after' && patchImage ? 'block' : 'none' }}>
            <canvas ref={canvasRef} className="rw-canvas" style={{ cursor: 'default' }} />
          </div>
        </>
      )
    }

    // 快速模式
    return (
      <>
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
        <div
          className="rw-result-container"
          style={{ display: viewMode === 'after' ? 'inline-block' : 'none' }}
        >
          <canvas ref={resultCanvasRef} className="rw-canvas rw-result-canvas" />
        </div>
      </>
    )
  }

  // --- 加载中 ---
  if (cvLoading) {
    return (
      <div className="re-watermark">
        <div className="rw-loading">
          <Spin />
          <p>{`${$t('opencv-loading')}...`}</p>
        </div>
      </div>
    )
  }

  // --- 加载失败 ---
  if (cvError) {
    return (
      <div className="re-watermark">
        <div className="rw-error">
          <p>{$t('fail-load-opencv')}</p>
          <p className="rw-error-detail">{cvError}</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            {$t('reload')}
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
          {/* 模式切换 */}
          <Segmented
            options={[
              { label: $t('fast'), value: 'fast', icon: <ThunderboltOutlined /> },
              { label: $t('quality'), value: 'quality', icon: <ExperimentOutlined /> },
            ]}
            value={repairMode}
            onChange={(val) => {
              const newMode = val as 'fast' | 'quality'
              if (newMode === repairMode) return

              if (!sourceImage) {
                // 没有上传图片时直接切换
                setRepairMode(newMode)
                return
              }

              Modal.confirm({
                title: $t('switch-mode'),
                content: `${$t('switch-to')}「${newMode === 'fast' ? $t('fast') : $t('quality')}」${$t('switch-tip')}？`,
                okText: $t('ok'),
                cancelText: $t('cancel'),
                onOk: () => {
                  setRepairMode(newMode)
                  handleReset()
                },
              })
            }}
            disabled={isProcessing}
          />

          {sourceImage && (
            <>
              <Tooltip title={$t('revoke-last')}>
                <Button
                  icon={<UndoOutlined />}
                  onClick={undoLastRect}
                  disabled={
                    isProcessing || !!(resultImageData || patchImage) ||
                    (repairMode === 'fast' ? rectsHistory.length === 0 : !hasKonvaStrokes)
                  }
                >
                  {$t('revoke')}
                </Button>
              </Tooltip>
              <Tooltip title={$t('clear-all')}>
                <Button
                  icon={<ClearOutlined />}
                  onClick={clearAllRects}
                  disabled={
                    isProcessing || !!(resultImageData || patchImage) ||
                    (repairMode === 'fast' ? rects.length === 0 : !hasKonvaStrokes)
                  }
                >
                  {$t('clear')}
                </Button>
              </Tooltip>
              <Button
                type="primary"
                icon={<ScissorOutlined />}
                onClick={handleRemoveWatermark}
                disabled={
                  isProcessing || !!(resultImageData || patchImage) ||
                  (repairMode === 'fast' ? rects.length === 0 : !hasKonvaStrokes)
                }
                danger
              >
                {isProcessing ? `${$t('handling')}...` : repairMode === 'quality' ? $t('AI-remove-watermark') : $t('remove-watermark')}
              </Button>
            </>
          )}

          {(resultImageData || patchImage) && (
            <>
              <Space.Compact>
                <Button type={viewMode === 'before' ? 'primary' : 'default'} onClick={() => setViewMode('before')}>
                  {$t('origin-image')}
                </Button>
                <Button type={viewMode === 'after' ? 'primary' : 'default'} onClick={() => setViewMode('after')}>
                  {$t('result-image')}
                </Button>
              </Space.Compact>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                {$t('result-download')}
              </Button>
            </>
          )}

          {sourceImage && (
            <Button icon={<DeleteOutlined />} onClick={handleReset} disabled={isProcessing}>
              {$t('reset')}
            </Button>
          )}
        </Space>
      </div>

      {/* 参数设置 */}
      {sourceImage && (
        <div className="rw-settings">
          <Space size="large" wrap>
            {repairMode === 'fast' ? (
              <>
                <div className="rw-setting-item">
                  <Tooltip title={$t('radius-tip')} placement='right'>
                    <span className="rw-setting-label">{$t('repair-radius')}: {inpaintRadius}px</span>
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
                  <span className="rw-setting-label">{$t('repair-algorithm')}:</span>
                  <Radio.Group
                    options={ALGORITHM_OPTIONS}
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    disabled={isProcessing || !!resultImageData}
                  />
                </div>
              </>
            ) : (
              <div className="rw-setting-item">
                <Tooltip title={$t('stroke-tip')} placement='right'>
                  <span className="rw-setting-label">{$t('stroke-size')}: {brushSize}px</span>
                </Tooltip>
                <Slider
                  min={5}
                  max={60}
                  value={brushSize}
                  onChange={setBrushSize}
                  disabled={isProcessing || !!(resultImageData || patchImage)}
                  style={{ width: 150 }}
                />
              </div>
            )}
          </Space>
        </div>
      )}

      {/* 选区列表（仅快速模式 + 修复完成前） */}
      {repairMode === 'fast' && rects.length > 0 && !resultImageData && (
        <div className="rw-rect-list">
          <span className="rw-rect-label">{$t('selected-area')} ({rects.length}):</span>
          {rects.map((r) => (
            <span key={r.id} className="rw-rect-tag">
              [{r.x}, {r.y}, {r.width}×{r.height}]
              <DeleteOutlined className="rw-rect-delete" onClick={() => removeRect(r.id)} />
            </span>
          ))}
        </div>
      )}

      {/* 图片编辑区 */}
      <div className="rw-workspace" ref={containerRef} style={{ position: 'relative' }}>
        {renderWorkspace()}
        <ProcessingOverlay visible={isProcessing} progress={processingProgress} />
      </div>
    </div>
  )
}
