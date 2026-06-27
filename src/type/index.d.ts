import type { ProcessInfo } from 'global';
export type { ProcessInfo }
export type TableColumn = React.ColumnType

export interface dataObj {
    [key: string]: any
}

/** 截图结果 */
export interface ScreenshotResult {
    success: boolean
    /** 裁剪后的 PNG Data URL (base64) */
    dataUrl?: string
    error?: string
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
        debugData?: ArrayBuffer
        error?: string
    }>
    /** 启动截图（全流程：捕获 → 选区 → 裁剪），返回裁剪后图片的 Data URL */
    captureScreen: () => Promise<ScreenshotResult>
    /** 将 Data URL 图片复制到系统剪贴板 */
    copyScreenshotToClipboard: (dataUrl: string) => Promise<{ success: boolean; error?: string }>
    /** 将 Data URL 图片保存到本地文件 */
    saveScreenshotToFile: (dataUrl: string) => Promise<{ success: boolean; filePath?: string; error?: string }>
    // ─── 快捷键 ───
    /** 获取当前截图快捷键 accelerator */
    getScreenshotShortcut: () => Promise<string>
    /** 设置新的截图快捷键，返回是否成功 */
    setScreenshotShortcut: (accelerator: string) => Promise<boolean>
    /** 获取通过全局快捷键触发的最近一次截图结果（取后即清空） */
    getShortcutScreenshotResult: () => Promise<ScreenshotResult | null>
    /** 监听全局快捷键触发事件（主进程 → 渲染进程） */
    onScreenshotShortcutTriggered: (callback: () => void) => void
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