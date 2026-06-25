import { useVirtualList } from "@/hooks/useVirtualList";
import { useListLayout } from "@/hooks/useListLayout";
import { dataProcessing } from "@/utils";
import { Tooltip } from "antd";
import { RightOutlined, FrownOutlined } from "@ant-design/icons";
import type { ProcessInfo, TableColumn } from '@/type/index'
import { useTranslation } from 'react-i18next'
import { SvgIcon } from "../SvgIcon";
import React from "react";
import "./index.less"

interface VirtualListConfig {
    list: any[],
    listConfig?: {
        containerHeight?: number,
        itemHeight?: number,
        onContextMenu?: (e: React.MouseEvent, type: 'headerContext' | 'itemContext') => void
    },
    headerConfig?: {
        height?: number,
        onClick?: (e: React.MouseEvent) => void
    },
    columns: TableColumn[]
}

const defaultItemHeight = 36
const defaultColumnWidth = 160
const deviationWidth = 64
const deviationHeight = 256
const fontSize = 14

export function VirtualList({ list, listConfig, columns }: VirtualListConfig) {

    const { container, content, itemList, contentStyle, itemRefs, expandedIds, toggleExpand } = useVirtualList(list, listConfig?.itemHeight);
    const { columnWidth, containerHeight } = useListLayout(columns, { deviationWidth, deviationHeight });
    const { t: $t } = useTranslation()
    const getCellStyle = (dataIndex: string, level?: string | number) => {
        const col = columns.find(col => col.dataIndex === dataIndex);
        const style: { [key: string]: string } = {
            flexBasis: col ? (col.width === 'auto' ? columnWidth : col.width) : defaultColumnWidth,
            textAlign: col?.align || 'left',
            display: col?.hidden ? 'none' : 'block',
            fontSize: `${fontSize}px`
        }
        if (level) {
            style.paddingLeft = `${(Number(level) + 1) * fontSize}px`
        }
        return style
    }

    const isEmpty = !list || list.length === 0

    return (
        <div className="virtual-list">
            <div className="virtual-list-header" onContextMenu={(e) => listConfig?.onContextMenu!(e, 'headerContext')} style={{ height: `${listConfig?.itemHeight || defaultItemHeight}px` }}>
                {columns.map((col) => (
                    <div className="header-column" key={col.dataIndex} style={getCellStyle(col.dataIndex)}>
                        {$t(col.dataIndex)}
                    </div>
                ))
                }
            </div>
            <div ref={container} className="virtual-list-content" style={{ height: `${containerHeight}px` }}>
                {isEmpty &&
                    <div className="no-data">
                        <FrownOutlined className="no-data-icon" />
                        <span className="no-data-text">{$t('no-data')}...</span>
                    </div>}
                {!isEmpty && <div ref={content} style={contentStyle}>
                    {itemList.map((item: ProcessInfo) => {
                        const formatData = dataProcessing(item);
                        const itemId = String(formatData.id ?? '');
                        const isExpanded = expandedIds.has(itemId);
                        const showDescriptionTooltip = Math.floor(columnWidth / fontSize) < formatData.description!.length
                        const showNameTooltip = Math.floor(columnWidth / fontSize) < formatData.name!.length
                        const hasChildren = !!item.children && item.children.length > 0
                        const itemClass = isExpanded ? 'list-item item-active' : 'list-item'
                        const cellClass = isExpanded ? 'cell-expand expanded' : 'cell-expand'
                        const icon = formatData.icon ? <img className="cell-icon" src={formatData.icon} alt={formatData.description} /> : <SvgIcon className="cell-icon" name="process" size={16} color="#12c281" />
                        return (
                            <div className={itemClass}
                                key={`${formatData.id}`}
                                id={formatData.id}
                                ref={node => itemRefs(node, formatData.id as string)}
                                style={{ height: `${listConfig?.itemHeight || defaultItemHeight}px` }}
                                onContextMenu={(e) => listConfig?.onContextMenu!(e, 'itemContext')}
                                data-pid={formatData.pid}
                                data-desc={formatData.description}
                            >
                                {showDescriptionTooltip ? (
                                    <Tooltip title={formatData.description}>
                                        <div className="list-cell" style={getCellStyle('description', formatData.level)} onClick={() => toggleExpand(itemId)}>
                                            {hasChildren && <RightOutlined className={cellClass}></RightOutlined>}
                                            {icon}
                                            <span className="cell-text">{formatData.description}</span>
                                        </div>
                                    </Tooltip>
                                ) : (<div className="list-cell" style={getCellStyle('description', formatData.level)} onClick={() => toggleExpand(itemId)}>
                                    {hasChildren && <RightOutlined className={cellClass}></RightOutlined>}
                                    {icon}
                                    <span>{formatData.description}</span>
                                </div>)}
                                <span className="list-cell" style={getCellStyle('type')}>{formatData.typeAlias}</span>
                                <span className="list-cell" style={getCellStyle('cpu')}>{formatData.cpuAlias}</span>
                                <span className="list-cell" style={getCellStyle('memory')}>{formatData.memoryAlias}</span>
                                {showNameTooltip ? (
                                    <Tooltip title={formatData.name}>
                                        <span className="list-cell cell-text" style={getCellStyle('name')}>{formatData.name}</span>
                                    </Tooltip>
                                ) : (<span className="list-cell cell-text" style={getCellStyle('name')}>{formatData.name}</span>)}
                                <span className="list-cell" style={getCellStyle('pid')}>{formatData.pid}</span>
                            </div>
                        )
                    })}
                </div>}
            </div>
        </div>

    );

}