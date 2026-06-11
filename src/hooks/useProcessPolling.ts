import { useEffect, useRef, useState } from 'react';
import { handleProcessesGroup } from '@/utils';


export function useProcessPolling(interval: number = 1500) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const computedPagationData = (page: number, pageSize: number): ProcessInfo[] => {
        // 在这里处理分页逻辑，例如请求新的数据或更新显示的数据
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = groupedData.slice(startIndex, endIndex);
        return paginatedData;
    }

    const fetchData = async () => {
        try {
            const rawData = await window.bridgeApis.getProcesses();
            const grouped = await handleProcessesGroup(rawData);

            // 假设这是你的逻辑更新
            const paginated = computedPagationData(grouped, defaultCurrentPage, pageSize);
            setData(paginated);
            setLoading(false);
        } catch (error) {
            console.error('Polling error:', error);
        } finally {
            // 在请求完成后，设置下一次请求
            timerRef.current = setTimeout(fetchData, interval);
        }
    };

    useEffect(() => {
        // 启动轮询
        fetchData();

        // 中断轮询：组件卸载时清除计时器
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [interval]);

    // 手动中断方法
    const stopPolling = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    return { data, loading, stopPolling };
}