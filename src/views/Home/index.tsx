import './index.less'
import HeaderBar from '@/components/HeaderBar'
import CardPanel from '@/components/CardPanel'
import ContextMenu from '@/components/ContextMenu'
import { useContextMenu } from '@/hooks/useContextMenu'
import { Button, Modal, message } from 'antd'
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import columnsData from '@/assets/json/columns.json'
import { handleProcessesGroup, handleTableColumns, getDataFingerprint, getSystemCpuUsage, formatUptime, formatMemory } from '@/utils'
import { exportToExcel } from '@/utils/exportExcel'
import { CheckOutlined, StopOutlined, ReloadOutlined, ExportOutlined } from "@ant-design/icons"
import type { TableColumn, ProcessInfo } from '@/type/index'
import { VirtualList } from '@/components/VirtualList'
import { ProcessingOverlay } from '@/components/ProcessingOverlay'
import i18n from '@/i18n'

const defaultColumnsLength = 5
const columnList = handleTableColumns(columnsData, defaultColumnsLength)

const killMessage = {
    0: 'fail-kill-process',
    1: 'has-kill-process',
    2: 'no-permission',
}

let groupedData: ProcessInfo[] = [];

export default function Home() {
    console.log('render')
    const { t: $t } = useTranslation()
    const { show, x, y, onOpen, onClose, menuRef } = useContextMenu();
    const [processesData, setProcessesData] = useState<ProcessInfo[]>([]);
    const [searchData, setSearchData] = useState<ProcessInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalConfig, setModalConfig] = useState({ title: 'operation-tip', open: false, loading: false, content: '', pid: 0 })
    const [tableColumn, setTableColumn] = useState<TableColumn[]>(columnList)
    const [showSearch, setShowSearch] = useState<boolean>(false)
    const pollingTimer = useRef<ReturnType<typeof setInterval> | null>(null)
    const isFetching = useRef(false)
    const isMounted = useRef(true)
    const lastFingerprint = useRef('')

    // 系统统计卡片数据
    const [cardData, setCardData] = useState({
        cpuUsage: 0,
        memoryUsed: 0,
        memoryTotal: 0,
        processCount: 0,
        activeProcessCount: 0,
        uptime: 0,
    })

    // 封装的数据获取方法，支持通过 pollingTimer 中断
    const fetchProcessData = async () => {
        // 防止上一次请求未完成时重复触发
        if (isFetching.current) return
        isFetching.current = true
        console.log('fetching data...')
        try {
            const data = await window.bridgeApis.getProcesses()
            // 如果组件已卸载或轮询已中断，丢弃结果
            if (!isMounted.current || !pollingTimer.current) return
            groupedData = await handleProcessesGroup(data)
            if (!isMounted.current || !pollingTimer.current) return

            // 并行拉取系统统计数据（无论进程数据是否变化，系统统计都要更新）
            const [systemMemory, systemCpuTimes, uptimeSeconds] = await Promise.all([
                window.bridgeApis.getSystemMemory(),
                window.bridgeApis.getSystemCpuTimes(),
                window.bridgeApis.getSystemUptime(),
            ])

            if (!isMounted.current || !pollingTimer.current) return

            // 计算卡片数据（始终更新）
            const cpuUsage = getSystemCpuUsage(systemCpuTimes)
            const activeCount = data.filter(p => p.type === 'app').length

            setCardData({
                cpuUsage,
                // load 是百分比(0-100)，真实用量 = total - available
                memoryUsed: (systemMemory.total ?? 0) - (systemMemory.free ?? 0),
                memoryTotal: systemMemory.total ?? 0,
                processCount: data.length,
                activeProcessCount: activeCount,
                uptime: uptimeSeconds,
            })

            // 数据指纹对比：无变化则跳过进程列表 setState，避免无效渲染
            const fingerprint = getDataFingerprint(groupedData)
            if (fingerprint === lastFingerprint.current) {
                console.log('process list unchanged, skip table render')
                return
            }
            lastFingerprint.current = fingerprint

            setProcessesData(groupedData)

            console.log('success...')
        } catch (error) {
            console.error('Error fetching process data:', error)
        } finally {
            isFetching.current = false
            if (!isMounted.current) return
            setLoading(false)
        }
    }

    /**
     * 启动轮询，每隔 intervalMs 执行一次数据获取
     * @param intervalMs 轮询间隔（毫秒），默认 1500
     */
    const startPolling = (intervalMs: number = 1500) => {
        stopPolling()
        // 立即执行第一次获取
        fetchProcessData()
        pollingTimer.current = setInterval(fetchProcessData, intervalMs)
    }

    /** 中断轮询 */
    const stopPolling = () => {
        if (pollingTimer.current !== null) {
            clearInterval(pollingTimer.current)
            pollingTimer.current = null
        }
    }

    useEffect(() => {
        isMounted.current = true
        startPolling(1500)

        return () => {
            isMounted.current = false
            stopPolling()
        }
    }, [])

    const onContextItem = useRef<EventTarget | null>(null)

    const killProcessByPid = () => {
        const target = onContextItem.current as HTMLElement | null
        const pid = target?.getAttribute('data-pid')
        const desc = target?.getAttribute('data-desc')
        setModalConfig(prev => ({ ...prev, open: true, content: `${$t('is-kill-process')}：${desc} (PID: ${pid})?`, pid: Number(pid) }));
    }

    const handleToggleColumn = useCallback((item: TableColumn) => {
        onClose();
        setTableColumn(prev => prev.map(col => {
            if (col.key === item.key) {
                return { ...col, hidden: !col.hidden }
            }

            return col;
        }));
    }, [onClose])

    const optionColors = ['var(--success-color)', 'var(--text-muted)'];
    const headerContext = useMemo(() => tableColumn.map((item) => {
        return (<div className={`hide-columns ${item.key}`} key={item.key} onClick={() => handleToggleColumn(item)}>
            <CheckOutlined style={{ color: optionColors[Number(item.hidden)] }} />
            <span>{$t(item.dataIndex)}</span>
        </div>)
    }), [tableColumn, handleToggleColumn,i18n.language]);

    const listItemContext = useMemo(() => (
        <div className='list-item-context' onClick={killProcessByPid}><StopOutlined /><p>{$t('kill-process')}</p></div>
    ), [])
    const contextMenuRender = useRef<React.ReactNode>(headerContext)


    const handleKillResult = (res: number) => {
        switch (res) {
            case 0:
                message.error($t(killMessage[0]));
                break;
            case 1:
                message.success($t(killMessage[1]));
                break;
            case 2:
                message.warning($t(killMessage[2]));
                break;
            default: message.error($t(killMessage[0]));
        }
    }

    const handleOk = () => {
        setModalConfig(prev => ({ ...prev, open: false }))
        handleKillResult(0)
    }
    const handleCancel = () => {
        setModalConfig(prev => ({ ...prev, open: false }))
    }

    const cardList = useMemo(() => {
        const { cpuUsage, memoryUsed, memoryTotal, processCount, activeProcessCount, uptime } = cardData;
        const memoryUsedStr = formatMemory(memoryUsed);
        const memoryTotalStr = formatMemory(memoryTotal);
        // 只取 used 的数值 + total 的数值用于展示
        const [usedVal, usedUnit] = memoryUsedStr.split(' ');
        const [totalVal, totalUnit] = memoryTotalStr.split(' ');

        return [
            {
                title: $t('CPU-TOTAL'),
                content: <div className='content-box'>
                    <span style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', paddingRight: 'var(--padding-secondary)' }}>{cpuUsage.toFixed(1)}%</span>
                    <span style={{ color: cpuUsage > 80 ? 'var(--error-color)' : 'var(--success-color)', fontSize: '12px' }}>{cpuUsage > 80 ? $t('HIGH') : $t('STABLE')}</span>
                </div>,
                style: { width: '100%', height: '64px' }
            },
            {
                title: $t('MEM-TOTAL'),
                content: <div className='content-box'>
                    <span style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', paddingRight: 'calc(var(--padding-secondary) * 0.5)' }}>{usedVal}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingRight: 'calc(var(--padding-secondary) * 0.5)' }}>{usedUnit}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '12px', paddingLeft: 'calc(var(--padding-secondary) * 0.5)' }}>{totalVal} {totalUnit}</span>
                </div>,
                style: { width: '100%', height: '64px' }
            },
            {
                title: $t('PROCESSES'),
                content: <div className='content-box'>
                    <span style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', paddingRight: 'var(--padding-secondary)' }}>{processCount}</span>
                    <span style={{ color: 'var(--success-color)', fontSize: '12px' }}>{activeProcessCount} {$t('ACTIVE')}</span>
                </div>,
                style: { width: '100%', height: '64px' }
            },
            {
                title: $t('UPTIME'),
                content: <div className='content-box'>
                    <span style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', paddingRight: 'var(--padding-secondary)' }}>{formatUptime(uptime)}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{uptime > 0 ? `${$t('RUNNING')}` : ''}</span>
                </div>,
                style: { width: '100%', height: '64px' }
            },
        ];
    }, [cardData]);

    const listConfig = useMemo(() => ({
        onContextMenu: (e: React.MouseEvent, type: string) => {
            if (type === 'headerContext') {
                contextMenuRender.current = headerContext
            }
            if (type === 'itemContext') {
                contextMenuRender.current = listItemContext
                onContextItem.current = e.currentTarget
            }
            onOpen?.(e)
        }
    }), [headerContext, listItemContext, onOpen])

    const processesDataRef = useRef(processesData)
    processesDataRef.current = processesData

    const handleSearch = useCallback((value: string) => {
        const trimmed = value.trim()
        if (!trimmed) {
            setShowSearch(false)
            setSearchData([])
            return
        }

        const lowerValue = trimmed.toLowerCase()
        const results: ProcessInfo[] = []

        // 递归搜索进程树（包括分组内的子进程）
        const searchTree = (list: ProcessInfo[]) => {
            for (const item of list) {
                const nameMatch = item.name?.toLowerCase().includes(lowerValue)
                const descMatch = item.description?.toLowerCase().includes(lowerValue)
                const pidMatch = String(item.pid ?? '').includes(lowerValue)

                if (nameMatch || descMatch || pidMatch) {
                    results.push(item)
                }
            }
        }

        searchTree(processesDataRef.current)
        setSearchData(results)
        setShowSearch(true)
    }, [])

    /** 刷新按钮：中断当前轮询 → 立即拉取一次 → 恢复轮询 */
    const handleRefresh = useCallback(() => {
        stopPolling()
        // 重新启动轮询：会先 stop 旧定时器 → 立即 fetch → 再开新定时器
        startPolling(1500)
    }, [])

    /** 导出按钮：将当前进程列表导出为 Excel（树形结构全部展开） */
    const handleExport = useCallback(() => {
        if (processesDataRef.current.length === 0) return;
        exportToExcel(processesDataRef.current);
    }, [])

    // 稳定 HeaderBar 的 children 引用，配合 React.memo 避免无效渲染
    const headerBarChildren = useMemo(() => (
        <div className='header-bar-right'>
            <Button type="default" color="default" variant="filled" className='refresh-button' icon={<ReloadOutlined />} onClick={handleRefresh}>
                {$t('refresh')}
            </Button>
            <Button type="default" color="default" variant="filled" className='thrmr-button' icon={<ExportOutlined />} onClick={handleExport}>{$t('export')}</Button>
        </div>
    ), [handleRefresh, handleExport,i18n.language])

    return (

        <div className="home">
            <ProcessingOverlay visible={loading} tip={`${$t('loading')}...`} loadingType='spin' />
            <HeaderBar className="home-header" onSearch={handleSearch}>
                {headerBarChildren}
            </HeaderBar>
            <div className="home-content">
                <div className="card-list">
                    {cardList.map((card, index) => (
                        <CardPanel key={index} title={card.title} content={card.content} style={card.style}></CardPanel>
                    ))}
                </div>

                <div style={{ display: !showSearch ? 'block' : 'none', width: '100%' }}>
                    <VirtualList list={processesData} columns={tableColumn} listConfig={listConfig}></VirtualList>
                </div>
                <div style={{ display: showSearch ? 'block' : 'none', width: '100%' }}>
                    <VirtualList list={searchData} columns={tableColumn} listConfig={listConfig}></VirtualList>
                </div>

                <ContextMenu style={{ width: '114px' }} show={show} x={x} y={y} onClose={onClose} menuRef={menuRef}>
                    {contextMenuRender.current}
                </ContextMenu>
                <Modal
                    title={$t(modalConfig.title)}
                    open={modalConfig.open}
                    confirmLoading={modalConfig.loading}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <p>{modalConfig.content}</p>
                </Modal>
            </div>
        </div >)
}