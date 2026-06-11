import { useState, useRef, useMemo, useEffect, useLayoutEffect, useCallback } from "react";
import { rafThrottle } from "@/utils";
import type { VirtualPosition, TreeData } from "@/type/index";

const bufferSize = 3; // 预加载缓冲区大小
//二分查找法
const binarySearch = (list: VirtualPosition[], scrollTop: number): number => {
    if (list.length === 0) return 0;
    let start = 0, end = list.length - 1;
    let result = list.length - 1; // 默认返回最后一个索引

    while (start <= end) {
        const mid = (start + end) >> 1;
        const bottom = list[mid].bottom;
        if (bottom === scrollTop) {
            return mid + 1 < list.length ? mid + 1 : mid;
        } else if (bottom < scrollTop) {
            start = mid + 1;
        } else {
            result = mid;
            end = mid - 1;
        }
    }
    return result;
};

const getBufferIndex = (startIndex: number, endIndex: number, bufferSize: number, dataLength: number) => {
    const bufferStart = Math.max(0, startIndex - bufferSize);
    const bufferEnd = Math.min(dataLength, endIndex + bufferSize);
    return { start: bufferStart, end: bufferEnd }
}

export function useVirtualList<T>(list: T[], itemHeight?: number) {

    const minHeight = itemHeight || 36;
    const container = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const oldDataLength = useRef<number>(0);
    const nodeMap = useRef<Map<string, { node: HTMLElement, id: string }>>(new Map());

    const positions = useRef<VirtualPosition[]>([]);

    const handleScroll = useRef<() => void>(null);
    const dataList = useRef<TreeData<T>[]>([]); // 存储树形结构的完整数据列表

    const [loadedData, setLoadedData] = useState<TreeData<T>[]>([]);  // 存储当前加载的扁平化数据列表
    const [listHeight, setListHeight] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(0);
    const [maxDataSize, setMaxDataSize] = useState<number>(0);
    const [expandedIds, setExpandedIds] = useState<Set<string | number>>(new Set());

    const loadedLengthRef = useRef(0);
    const observerRef = useRef<ResizeObserver | null>(null);

    const itemRefs = useCallback((node: HTMLElement | null, id: string) => {
        if (node) {
            nodeMap.current.set(id, { node, id });
            observerRef.current?.observe(node);
        } else {
            const target = nodeMap.current.get(id)?.node
            if (target) {
                nodeMap.current.delete(id);
                observerRef.current?.unobserve(target);
            }
        }
    }, []);

    const flattenTree = useCallback((nodes: TreeData<T>[]): TreeData<T>[] => {
        let result: TreeData<T>[] = [];
        nodes.forEach(node => {
            result.push({ ...node, isExpanded: expandedIds.has(String(node.id)) });
            if (expandedIds.has(String(node.id)) && node.children) {
                result = result.concat(flattenTree(node.children));
            }
        });
        return result;
    }, [expandedIds]);

    const toggleExpand = useCallback((id: string | number) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const endIndex = useMemo(() => {
        return Math.min(startIndex + maxDataSize + 1, loadedData.length);
    }, [loadedData, startIndex, maxDataSize]);

    const itemList = useMemo(() => {
        const { start, end } = getBufferIndex(startIndex, endIndex, bufferSize, loadedData.length);
        return loadedData.slice(start, end);

    }, [loadedData, startIndex, endIndex]);

    const scrollHeight = useMemo(() => {
        return startIndex > 0 ? positions.current[startIndex - 1].bottom : 0
    }, [startIndex]);

    const contentStyle = useMemo<React.CSSProperties>(() => {
        return {
            height: `${listHeight - scrollHeight}px`,
            transform: `translate3d(0, ${scrollHeight}px, 0)`
        }
    }, [listHeight, scrollHeight]);

    const startIndexRef = useRef<number>(startIndex);
    const endIndexRef = useRef<number>(endIndex);
    const maxDataSizeRef = useRef<number>(maxDataSize);

    const calculatePositions = () => {
        if (positions.current.length === 0) return;


        let currentBottom = 0;
        for (let i = 0; i < positions.current.length; i++) {

            const item = positions.current[i];
            item.top = currentBottom;
            item.bottom = currentBottom + item.height;
            currentBottom = item.bottom;
        }
        setListHeight(currentBottom);
    }

    const initPositions = () => {
        // 检测树结构变化：对比已缓存的 positions 与当前 loadedData 是否匹配
        let needsRebuild = loadedData.length < oldDataLength.current;
        if (!needsRebuild) {
            for (let i = 0; i < Math.min(positions.current.length, loadedData.length); i++) {
                if (positions.current[i]?.id !== loadedData[i]?.id) {
                    needsRebuild = true;
                    break;
                }
            }
        }

        if (needsRebuild) {
            positions.current = [];
            oldDataLength.current = 0;
        }

        const tempList: VirtualPosition[] = [];
        const prevItem = positions.current[positions.current.length - 1];
        const prevBottom = prevItem ? prevItem.bottom : 0;
        const diffDataLength = loadedData.length - oldDataLength.current;
        for (let i = 0; i < diffDataLength; i++) {
            const index = i + oldDataLength.current;
            const top = prevBottom ? prevBottom + (minHeight * i) : minHeight * i;
            const bottom = prevBottom ? prevBottom + minHeight * (i + 1) : minHeight * (i + 1);
            tempList.push({ id: loadedData[index]?.id, index, top, bottom, height: minHeight, diffHeight: 0 });

        }

        positions.current = [...positions.current, ...tempList];
        oldDataLength.current = loadedData.length;

        // 树结构变化后，重新计算所有位置和总高度
        if (needsRebuild && positions.current.length > 0) {
            calculatePositions();
        }
    }


    useEffect(() => {
        startIndexRef.current = startIndex;
        endIndexRef.current = endIndex;
    }, [startIndex, endIndex])

    useEffect(() => {
        maxDataSizeRef.current = maxDataSize;
    }, [maxDataSize])

    useEffect(() => {
        handleScroll.current = rafThrottle(() => {
            if (!container.current) return;
            const { scrollTop, scrollHeight, clientHeight } = container.current!;
            const newStart = binarySearch(positions.current, scrollTop)
            // console.log('loadedData.length:', loadedData.length)
            // console.log('positions:', positions.current)

            setStartIndex(Math.max(0, newStart))

            //加载数据...
            const restHeight = scrollHeight - clientHeight - scrollTop
            if (restHeight <= 30) {
                const batchSize = maxDataSizeRef.current + bufferSize;
                const nextLength = Math.min(loadedLengthRef.current + batchSize, dataList.current.length);
                setLoadedData(dataList.current.slice(0, nextLength));
                loadedLengthRef.current = nextLength;
            }
        });

        const handler = () => handleScroll.current && handleScroll.current();
        const el = container.current;
        el?.addEventListener('scroll', handler);
        return () => el?.removeEventListener('scroll', handler);
    }, [])

    const init = () => {
        positions.current = [];
        oldDataLength.current = 0;
        setStartIndex(0);
    }

    useEffect(() => {
        dataList.current = flattenTree(list as TreeData<T>[]);
        // 使用 ref 获取最新的 maxDataSize，避免因 resize 导致 loadedData 被重置
        const batchSize = (maxDataSizeRef.current || 10) + bufferSize;
        const neededLength = startIndexRef.current + batchSize + 1;
        const initialData = dataList.current.slice(0, Math.min(neededLength, dataList.current.length));
        setLoadedData(initialData);
        loadedLengthRef.current = initialData.length;
    }, [list, flattenTree])

    useLayoutEffect(() => {
        if (loadedData.length > 0) {
            initPositions();
            handleScroll.current?.();
        }
    }, [loadedData]);

    useLayoutEffect(() => {
        if (!content.current) return;
        observerRef.current = new ResizeObserver((entries) => {
            let shouldUpdate = false;
            for (const entry of entries) {
                const item = positions.current.find(pos => pos.id === entry.target.id) as VirtualPosition;
                const realHeight = entry.contentRect.height;
                if (item && realHeight !== item.height) {
                    item.height = realHeight;
                    shouldUpdate = true;
                }
            }

            if (shouldUpdate) {
                calculatePositions();
            }
        })

        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
        };
    }, [])

    useLayoutEffect(() => {
        init()
        dataList.current = flattenTree(list as TreeData<T>[]);
        let ob: ResizeObserver | null = new ResizeObserver(([entry]) => {
            const containerHeight = entry.contentRect.height;
            const maxSize = Math.ceil(containerHeight / minHeight);
            setMaxDataSize(maxSize);

            // 缩放窗口后，确保已加载足够的数据填充新的可视区域
            const neededLength = startIndexRef.current + maxSize + bufferSize + 1;
            if (neededLength > loadedLengthRef.current && loadedLengthRef.current < dataList.current.length) {
                const nextLength = Math.min(neededLength + bufferSize, dataList.current.length);
                setLoadedData(dataList.current.slice(0, nextLength));
                loadedLengthRef.current = nextLength;
            }

            // 缩放窗口后，重新触发 scroll handler 以基于当前 scrollTop 重新计算 startIndex，
            // 保证列表开头的数据项在缩放前后保持一致
            requestAnimationFrame(() => {
                handleScroll.current?.();
            });
        });
        ob.observe(container.current!);

        return () => {
            ob?.disconnect();
            ob = null;
        }
    }, []);

    return {
        container,
        content,
        itemList,
        contentStyle,
        itemRefs,
        expandedIds,
        toggleExpand,
    }
}