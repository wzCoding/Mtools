
import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, message, Empty, Tooltip, Popconfirm, Image, Modal, Tag, Space } from 'antd'
import {
  CameraOutlined,
  CopyOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ZoomInOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import HeaderBar from '@/components/HeaderBar'
import './index.less'

/** 单条截图历史记录 */
interface ScreenshotRecord {
  /** 唯一 ID */
  id: string
  /** PNG Data URL */
  dataUrl: string
  /** 创建时间 */
  timestamp: number
}

export default function Screenshot() {
  const { t: $t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()

  // ─── 状态 ───
  const [history, setHistory] = useState<ScreenshotRecord[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [shortcutModalOpen, setShortcutModalOpen] = useState(false)
  const [currentAccelerator, setCurrentAccelerator] = useState('')
  const [pendingAccelerator, setPendingAccelerator] = useState('')
  const [recording, setRecording] = useState(false)
  const recordRef = useRef(false)

  // ─── 初始化：加载快捷键 & 检查快捷键触发的结果 ───
  useEffect(() => {
    // 加载当前快捷键
    if (window.bridgeApis?.getScreenshotShortcut) {
      window.bridgeApis.getScreenshotShortcut().then(setCurrentAccelerator)
    }
    // 检查是否有通过全局快捷键触发的结果
    if (window.bridgeApis?.getShortcutScreenshotResult) {
      window.bridgeApis.getShortcutScreenshotResult().then((result) => {
        if (result?.success && result.dataUrl) {
          const record: ScreenshotRecord = {
            id: `sc_shortcut_${Date.now()}`,
            dataUrl: result.dataUrl,
            timestamp: Date.now(),
          }
          setHistory((prev) => [record, ...prev])
          setSelectedId(record.id)
          messageApi.success($t('screenshot-success'))
        }
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 当前选中的截图记录
  const selectedRecord = history.find((r) => r.id === selectedId) ?? null

  // ─── 开始截图 ───
  const handleStartCapture = useCallback(async () => {
    if (capturing) return

    // 检查 bridgeApis 是否可用
    if (!window.bridgeApis?.captureScreen) {
      messageApi.error($t('bridge-apis-unready'))
      return
    }

    setCapturing(true)
    try {
      const result = await window.bridgeApis.captureScreen()

      if (result.success && result.dataUrl) {
        const record: ScreenshotRecord = {
          id: `sc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          dataUrl: result.dataUrl,
          timestamp: Date.now(),
        }

        setHistory((prev) => [record, ...prev])
        setSelectedId(record.id)
        messageApi.success($t('screenshot-success'))
      } else if (result.error) {
        // 用户取消截图时不提示错误
        if (result.error !== '用户取消截图') {
          messageApi.info($t('screenshot-cancel'))
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      messageApi.error(`${$t('screenshot-fail')}: ${msg}`)
    } finally {
      setCapturing(false)
    }
  }, [capturing, $t, messageApi])

  // ─── 复制到剪贴板 ───
  const handleCopy = useCallback(async () => {
    if (!selectedRecord?.dataUrl) return

    if (!window.bridgeApis?.copyScreenshotToClipboard) {
      // 降级方案：使用浏览器 Clipboard API
      try {
        const base64 = selectedRecord.dataUrl.split(',')[1]
        const byteChars = atob(base64)
        const byteNums = new Array(byteChars.length)
        for (let i = 0; i < byteChars.length; i++) {
          byteNums[i] = byteChars.charCodeAt(i)
        }
        const byteArr = new Uint8Array(byteNums)
        const blob = new Blob([byteArr], { type: 'image/png' })
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        messageApi.success($t('copy-success'))
      } catch {
        messageApi.error($t('copy-fail'))
      }
      return
    }

    const result = await window.bridgeApis.copyScreenshotToClipboard(selectedRecord.dataUrl)
    if (result.success) {
      messageApi.success($t('copy-success'))
    } else {
      messageApi.error(`${$t('copy-fail')}: ${result.error}`)
    }
  }, [selectedRecord, $t, messageApi])

  // ─── 保存到本地 ───
  const handleSave = useCallback(async () => {
    if (!selectedRecord?.dataUrl) return

    if (!window.bridgeApis?.saveScreenshotToFile) {
      // 降级：创建 a 标签下载
      const a = document.createElement('a')
      a.href = selectedRecord.dataUrl
      a.download = `screenshot_${selectedRecord.timestamp}.png`
      a.click()
      messageApi.success($t('save-success'))
      return
    }

    const result = await window.bridgeApis.saveScreenshotToFile(selectedRecord.dataUrl)
    if (result.success) {
      messageApi.success($t('save-success'))
    }
  }, [selectedRecord, $t, messageApi])

  // ─── 删除单条记录 ───
  const handleDelete = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((r) => r.id !== id)
      // 如果删除的是当前选中项，切换到第一条
      if (selectedId === id) {
        setSelectedId(next.length > 0 ? next[0].id : null)
      }
      return next
    })
  }, [selectedId])

  // ─── 格式化时间 ───
  const formatTime = (ts: number): string => {
    const d = new Date(ts)
    return d.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // ─── 快捷键相关 ───

  /** 将 Electron accelerator 转为人类可读的按键显示 */
  const formatAccelerator = (acc: string): string => {
    if (!acc) return ''
    const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform ?? '')
    return acc
      .replace(/CommandOrControl/g, isMac ? '⌘' : 'Ctrl')
      .replace(/Command/g, '⌘')
      .replace(/Control/g, 'Ctrl')
      .replace(/Super/g, isMac ? '⌘' : 'Win')
      .replace(/Alt/g, isMac ? '⌥' : 'Alt')
      .replace(/Shift/g, isMac ? '⇧' : 'Shift')
      .replace(/\+/g, ' + ')
      .replace(/Key/g, '')
      .replace(/Digit/g, '')
  }

  /** 打开快捷键设置弹窗 */
  const openShortcutModal = useCallback(async () => {
    if (window.bridgeApis?.getScreenshotShortcut) {
      const acc = await window.bridgeApis.getScreenshotShortcut()
      setCurrentAccelerator(acc)
      setPendingAccelerator('')
    }
    setShortcutModalOpen(true)
  }, [])

  /** 关闭弹窗 */
  const closeShortcutModal = useCallback(() => {
    setRecording(false)
    recordRef.current = false
    setShortcutModalOpen(false)
  }, [])

  /** 开始录制快捷键 */
  const startRecording = useCallback(() => {
    setPendingAccelerator('')
    setRecording(true)
    recordRef.current = true
  }, [])

  /** 处理录制中的按键 */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!recordRef.current) return
    e.preventDefault()
    e.stopPropagation()

    const parts: string[] = []
    let hasMainKey = false

    // macOS: 优先区分 Command 和 Ctrl
    if (e.metaKey) parts.push('Command')
    if (e.ctrlKey) parts.push('Control')
    if (e.altKey) parts.push('Alt')
    if (e.shiftKey) parts.push('Shift')

    // 获取主键（排除单独的修饰键）
    const modifierOnly = ['Control', 'Alt', 'Shift', 'Meta', 'OS']
    if (!modifierOnly.includes(e.key)) {
      const key = e.code
        .replace('Key', '')
        .replace('Digit', '')
        .replace('Numpad', 'num')
      parts.push(key)
      hasMainKey = true
    }

    // 必须包含至少 1 个实体键 + 总共 2~3 个键
    if (hasMainKey && parts.length >= 2 && parts.length <= 3) {
      const accelerator = parts.join('+')
      setPendingAccelerator(accelerator)
      setRecording(false)
      recordRef.current = false
    } else if (parts.length > 3) {
      // 超过 3 个键，重置并提示
      setPendingAccelerator('')
      setRecording(false)
      recordRef.current = false
      messageApi.warning($t('shortcut-too-many'))
    }
  }, [])

  /** 保存快捷键 */
  const saveShortcut = useCallback(async () => {
    if (!pendingAccelerator || !window.bridgeApis?.setScreenshotShortcut) return

    const ok = await window.bridgeApis.setScreenshotShortcut(pendingAccelerator)
    if (ok) {
      setCurrentAccelerator(pendingAccelerator)
      setPendingAccelerator('')
      messageApi.success($t('shortcut-save-success'))
      closeShortcutModal()
    } else {
      messageApi.error($t('shortcut-save-fail'))
    }
  }, [pendingAccelerator, $t, messageApi, closeShortcutModal])

  return (
    <div className="screenshot-page">
      {contextHolder}

      {/* 顶部操作栏 */}
      <HeaderBar className="screenshot-header" onSearch={() => {}}>
        <div className="header-actions">
          <Tooltip title={`${$t('screenshot-tip')}\n${$t('screenshot-shortcut')}`}>
            <Button
              type="primary"
              icon={<CameraOutlined />}
              loading={capturing}
              onClick={handleStartCapture}
            >
              {$t('start-screenshot')}
            </Button>
          </Tooltip>
          <Tooltip title={$t('shortcut-settings')}>
            <Button
              icon={<SettingOutlined />}
              onClick={openShortcutModal}
            />
          </Tooltip>
        </div>
      </HeaderBar>

      {/* 主体 */}
      <div className="screenshot-body">
        {/* 预览区 */}
        <div className="screenshot-preview">
          {selectedRecord ? (
            <>
              <div className="preview-image-wrapper">
                <Image
                  src={selectedRecord.dataUrl}
                  alt="screenshot"
                  className="preview-image"
                  preview={{
                    visible: previewVisible,
                    onVisibleChange: setPreviewVisible,
                    mask: null,
                  }}
                />
              </div>
              <div className="preview-actions">
                <Button
                  icon={<ZoomInOutlined />}
                  onClick={() => setPreviewVisible(true)}
                >
                  {$t('zoom-in')}
                </Button>
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                >
                  {$t('copy-to-clipboard')}
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleSave}
                >
                  {$t('save-to-file')}
                </Button>
                <Popconfirm
                  title={$t('ok')}
                  onConfirm={() => handleDelete(selectedRecord.id)}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            </>
          ) : (
            <div className="preview-empty">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={$t('no-screenshot')}
              />
            </div>
          )}
        </div>

        {/* 历史列表 */}
        <div className="screenshot-history">
          <div className="history-title">{$t('screenshot-history')}</div>
          {history.length === 0 ? (
            <div className="history-empty">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={$t('no-screenshot')}
              />
            </div>
          ) : (
            <div className="history-list">
              {history.map((record) => (
                <div
                  key={record.id}
                  className={`history-item ${record.id === selectedId ? 'selected' : ''}`}
                  onClick={() => setSelectedId(record.id)}
                >
                  <div className="history-thumb">
                    <img src={record.dataUrl} alt="" />
                  </div>
                  <div className="history-info">
                    <span className="history-time">{formatTime(record.timestamp)}</span>
                    {record.id === selectedId && (
                      <CheckCircleOutlined className="history-check" />
                    )}
                  </div>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(record.id)
                    }}
                    className="history-delete"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 快捷键设置弹窗 ─── */}
      <Modal
        title={$t('shortcut-settings')}
        open={shortcutModalOpen}
        onCancel={closeShortcutModal}
        footer={[
          <Button key="cancel" onClick={closeShortcutModal}>
            {$t('cancel')}
          </Button>,
          <Button
            key="save"
            type="primary"
            disabled={!pendingAccelerator}
            onClick={saveShortcut}
          >
            {$t('ok')}
          </Button>,
        ]}
      >
        <div className="shortcut-modal-content">
          <div className="shortcut-current">
            <span className="shortcut-label">{$t('current-shortcut')}：</span>
            {currentAccelerator ? (
              <Tag color="blue">{formatAccelerator(currentAccelerator)}</Tag>
            ) : (
              <Tag color="default">{$t('no-data')}</Tag>
            )}
          </div>

          <div className="shortcut-recorder">
            <div className="shortcut-label">{$t('record-shortcut')}：</div>
            <div
              className={`shortcut-input ${recording ? 'recording' : ''} ${pendingAccelerator ? 'filled' : ''}`}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onClick={startRecording}
            >
              {recording ? (
                <span className="recording-hint">{$t('recording-shortcut')}</span>
              ) : pendingAccelerator ? (
                <Tag color="green">{formatAccelerator(pendingAccelerator)}</Tag>
              ) : (
                <span className="recording-hint">{$t('record-shortcut')}</span>
              )}
            </div>
          </div>

          <div className="shortcut-tip">
            {$t('shortcut-require-modifier')}
          </div>
        </div>
      </Modal>
    </div>
  )
}