import { useState, useMemo, useLayoutEffect } from "react";
import type { TableColumn } from '@/type/index'
import { debounce } from "@/utils";

interface LayoutConfig {
    deviationWidth: number
    deviationHeight: number
}

export function useListLayout(columns: TableColumn[], config: LayoutConfig = {
    deviationHeight: 0,
    deviationWidth: 0
}) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // 计算固定列宽、auto 列数量
    const layout = useMemo(() => {
        const fixed = columns.filter(c => c.width !== "auto" && !c.hidden);
        const hidden = columns.filter(c => c.hidden);
        const auto = columns.filter(c => c.width === "auto" && !c.hidden);

        const fixedWidth = fixed.reduce((s, c) => s + Number(c.width), 0);
        const autoCount = auto.length;

        return { fixed, hidden, auto, fixedWidth, autoCount };
    }, [columns]);

    // 计算 auto 列宽
    const columnWidth = useMemo(() => {
        if (layout.autoCount === 0) return 0;

        const raw = (containerWidth - layout.fixedWidth) / layout.autoCount;

        // 可选：加入最小/最大宽度保护
        const min = 60;
        const max = 400;

        return Math.min(Math.max(raw, min), max);
    }, [containerWidth, layout.fixedWidth, layout.autoCount]);

    // 方案五：一次性测量 + window.resize
    useLayoutEffect(() => {
        const measure = debounce(() => {
            const width = window.innerWidth - config.deviationWidth;
            const height = window.innerHeight - config.deviationHeight;
            setContainerWidth(prev => Math.abs(prev - width) > 1 ? width : prev);
            setContainerHeight(prev => Math.abs(prev - height) > 1 ? height : prev)
        }, 200)

        measure()

        // 监听 window.resize
        window.addEventListener("resize", measure);

        return () => {
            window.removeEventListener("resize", measure);
        };
    }, []);

    return { columnWidth,containerHeight };
}
