import { useState, useEffect, useRef } from 'react'
import { Spin, Progress } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import './index.less'

interface ProcessingOverlayProps {
  visible: boolean
  progress?: number
  tip?: string
}

export default function ProcessingOverlay({ visible, progress, tip = 'AI 正在处理图片...' }: ProcessingOverlayProps) {
  const [simulated, setSimulated] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!visible) {
      setSimulated(0)
      return
    }

    if (progress !== undefined && progress >= 100) {
      setSimulated(100)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    timerRef.current = setInterval(() => {
      setSimulated((prev) => {
        if (prev >= 99.9) return 99.9
        const increment = prev < 50 ? 2 + Math.random() * 3
          : prev < 80 ? 1 + Math.random()
          : 0.2 + Math.random() * 0.5
        return Math.min(99.9, prev + increment)
      })
    }, 500)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [visible, progress])

  if (!visible) return null

  const displayProgress = progress !== undefined && progress >= 100 ? 100 : simulated

  return (
    <div className="processing-overlay">
      <div className="processing-overlay-content">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#1677ff' }} spin />}
          tip={tip}
        >
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={Math.round(displayProgress)}
              size={80}
              strokeColor="#1677ff"
              format={(p) => `${p}%`}
            />
          </div>
        </Spin>
      </div>
    </div>
  )
}
