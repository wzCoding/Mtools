import type { ProcessInfo } from 'global';
export type { ProcessInfo }
export type TableColumn = React.ColumnType

export interface dataObj {
    [key: string]: any
}

export type FileCacheData  = Map<string, { icon: string, description: string }>

export interface Position {
    x: number
    y: number
}

export interface ProcessInfoAlias extends ProcessInfo {
    typeAlias: string,
    cpuAlias: string,
    memoryAlias: string,
}

export interface VirtualPosition {
    id: string,
    index:number,
    top: number,
    bottom: number,
    height: number,
    diffHeight: number
}

// ─── Electron Bridge API 类型 ───
export interface BridgeApis {
    maximize: () => void
    minimize: () => void
    close: () => void
    getProcesses: () => Promise<ProcessInfo[]>
    getProcessMemory: (pid: number) => Promise<any>
    getSystemMemory: () => Promise<any>
    getProcessCpuTimes: (pid: number) => Promise<any>
    getSystemCpuTimes: () => Promise<any>
    getFileDescription: (path: string) => Promise<string>
    getAppIcon: (appPath: string) => Promise<string>
    killProcess: (pid: number) => Promise<number>
    getSystemUptime: () => Promise<number>
    /** LaMa AI 高质量去水印 */
    inpaintLaMa: (imageBuffer: ArrayBuffer, maskBuffer: ArrayBuffer) => Promise<{
        success: boolean
        data?: ArrayBuffer
        error?: string
    }>
}

declare global {
    interface Window {
        bridgeApis: BridgeApis
    }
}

export type TreeData<T> = T & {
    children?: TreeData<T>[];
    id: string; // 绝对索引 (用于标识)
    level: number;        // 层级 (用于缩进)
    isExpanded: boolean;  // 展开状态
};

export interface ContextMenuProps {
    id?: string; // 可选的唯一标识
    style?: React.CSSProperties; // 可选的样式属性
    show: boolean;
    onClose: () => void;
    onOpen?: (e: React.MouseEvent) => void;
    x: number;
    y: number;
    menuRef: React.RefObject<HTMLDivElement>; // 传入 hook 中的 ref
    children?: React.ReactNode;
} 