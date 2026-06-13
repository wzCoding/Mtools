/**
 * Konva 画布组件 —— 支持自由笔刷绘制水印遮罩
 * 用于高质量模式的选区绘制，导出 mask 图传给 LaMa 模型
 * 交互按钮（撤销/清空/笔刷大小）由父组件统一管理
 */
import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva'
import Konva from 'konva'

interface BrushStroke {
  id: number
  points: number[]
  brushSize: number
}

interface KonvaCanvasProps {
  /** HTML Image 元素 */
  image: HTMLImageElement | null
  /** 容器宽度 */
  containerWidth: number
  /** 容器高度 */
  containerHeight: number
  /** 是否禁用交互 */
  disabled?: boolean
  /** 笔刷大小（由父组件控制） */
  brushSize?: number
  /** 笔触变化回调，通知父组件更新按钮状态 */
  onStrokesChange?: (hasStrokes: boolean) => void
}

export interface KonvaCanvasRef {
  /** 导出遮罩图为 PNG DataURL */
  exportMask: () => string
  /** 清空所有笔触 */
  clearAll: () => void
  /** 撤销最后一笔 */
  undoLast: () => void
  /** 是否有绘制内容 */
  hasStrokes: () => boolean
}

const KonvaCanvas = forwardRef<KonvaCanvasRef, KonvaCanvasProps>(
  ({ image, containerWidth, containerHeight, disabled = false, brushSize = 20, onStrokesChange }, ref) => {
    const stageRef = useRef<Konva.Stage>(null)
    const isDrawing = useRef(false)
    const strokeIdCounter = useRef(0)

    const [strokes, setStrokes] = useState<BrushStroke[]>([])

    // 图片显示尺寸
    const [displaySize, setDisplaySize] = useState({ w: 0, h: 0, x: 0, y: 0 })

    // 计算图片显示参数（父组件已传入去除 padding 后的精确可用尺寸）
    useEffect(() => {
      if (!image || containerWidth <= 0) return
      const scale = Math.min(containerWidth / image.naturalWidth, containerHeight / image.naturalHeight, 1)
      const w = Math.floor(image.naturalWidth * scale)
      const h = Math.floor(image.naturalHeight * scale)
      const x = Math.floor((containerWidth - w) / 2)
      const y = Math.floor((containerHeight - h) / 2)
      setDisplaySize({ w, h, x, y })
    }, [image, containerWidth, containerHeight])

    // 创建 Konva Image 对象
    const [konvaImage, setKonvaImage] = useState<HTMLImageElement | null>(null)
    useEffect(() => {
      if (!image) return
      const img = new window.Image()
      img.src = image.src
      img.onload = () => setKonvaImage(img)
    }, [image])

    // 导出 mask
    const exportMask = useCallback((): string => {
      if (!stageRef.current) return ''
      // 克隆 stage，只保留笔触层
      const stage = stageRef.current
      const maskStage = new Konva.Stage({
        width: image?.naturalWidth ?? stage.width(),
        height: image?.naturalHeight ?? stage.height(),
        container: document.createElement('div'),
      })
      const maskLayer = new Konva.Layer()
      maskStage.add(maskLayer)

      // 计算缩放比（笔触坐标是显示坐标，需映射到原图坐标）
      const scaleX = (image?.naturalWidth ?? 1) / displaySize.w
      const scaleY = (image?.naturalHeight ?? 1) / displaySize.h

      for (const stroke of strokes) {
        const scaledPoints = stroke.points.map((p, i) =>
          i % 2 === 0 ? (p - displaySize.x) * scaleX : (p - displaySize.y) * scaleY
        )
        maskLayer.add(
          new Konva.Line({
            points: scaledPoints,
            stroke: 'white',
            strokeWidth: stroke.brushSize * Math.max(scaleX, scaleY),
            tension: 0.5,
            lineCap: 'round',
            lineJoin: 'round',
            globalCompositeOperation: 'source-over',
          })
        )
      }

      maskLayer.draw()
      return maskStage.toDataURL({ mimeType: 'image/png', pixelRatio: 1 })
    }, [strokes, displaySize, image])

    // 暴露方法给父组件
    const undoLast = () => setStrokes((prev) => prev.slice(0, -1))
    const clearAll = () => setStrokes([])

    useImperativeHandle(ref, () => ({
      exportMask,
      clearAll,
      undoLast,
      hasStrokes: () => strokes.length > 0,
    }), [exportMask, strokes, undoLast])

    // 鼠标/触控事件
    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (disabled) return
      isDrawing.current = true
      const pos = e.target.getStage()?.getPointerPosition()
      if (!pos) return
      const id = strokeIdCounter.current++
      setStrokes((prev) => [...prev, { id, points: [pos.x, pos.y], brushSize }])
    }

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!isDrawing.current || disabled) return
      const pos = e.target.getStage()?.getPointerPosition()
      if (!pos) return
      setStrokes((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last) {
          last.points = [...last.points, pos.x, pos.y]
        }
        return updated
      })
    }

    const handleMouseUp = () => {
      isDrawing.current = false
    }

    // 通知父组件笔触状态变化（驱动按钮可用性）
    useEffect(() => {
      onStrokesChange?.(strokes.length > 0)
    }, [strokes.length, onStrokesChange])

    if (!image) return null

    return (
      <Stage
          ref={stageRef}
          width={containerWidth}
          height={containerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{ cursor: disabled ? 'default' : 'crosshair' }}
        >
          <Layer>
            {/* 原图 */}
            {konvaImage && (
              <KonvaImage
                image={konvaImage}
                x={displaySize.x}
                y={displaySize.y}
                width={displaySize.w}
                height={displaySize.h}
              />
            )}
          </Layer>
          <Layer>
            {/* 笔触 — 半透明红色表示遮罩区域 */}
            {strokes.map((stroke) => (
              <Line
                key={stroke.id}
                points={stroke.points}
                stroke="rgba(255, 77, 79, 0.55)"
                strokeWidth={stroke.brushSize}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation="source-over"
              />
            ))}
          </Layer>
        </Stage>
    )
  }
)

KonvaCanvas.displayName = 'KonvaCanvas'
export default KonvaCanvas
