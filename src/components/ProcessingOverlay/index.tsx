import { useState, useEffect, useRef } from 'react'
import { Spin, Progress } from 'antd'
import './index.less'

interface ProcessingOverlayProps {
    visible: boolean
    progress?: number
    tip?: string
    loadingType?: 'progress' | 'spin'
}

export function ProcessingOverlay({ visible, progress, tip = `${$t('AI-processing')}...`, loadingType = 'progress' }: ProcessingOverlayProps) {
    const [simulated, setSimulated] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (!visible) {
            setSimulated(0)
            return
        }

        if (progress !== undefined && progress >= 100) {
            setSimulated(99.9)
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
                        : 0.3 + Math.random() * 0.5
                return Math.min(99.9, prev + increment)
            })
        }, 200)

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
                {loadingType === 'progress' && <Progress
                    type='line'
                    percent={Math.round(displayProgress)}
                    percentPosition={{ align: 'center', type: 'inner' }}
                    size={[200, 20]}
                    strokeColor="#1677ff"
                    format={(p) => `${p}%`}
                />}
                {loadingType === 'spin' && <Spin></Spin>}
                <span className='progress-tip'>{tip}</span>
            </div>
        </div>
    )
}
