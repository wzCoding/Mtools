declare module 'virtual:svg-icons-register' {
    const component: any
    export default component
}

declare module '*.html?raw' {
    const content: string
    export default content
}

declare global {
    /** 全局翻译函数，等价于 i18n.t */
    var $t: (key: string, options?: Record<string, unknown>) => string
}

export interface ProcessInfo {
    description?: string
    name: string
    key?: string
    path?: string
    pid?: number
    type?: 'app' | 'background'
    memory?: number
    cpu?: number
    isGroup?: boolean
    children?: ProcessInfo[]
    action?: string
    id?: string
    icon?: string
    level?: number
}

export interface ProcessMemoryInfo {
    pid?: number
    name?: string
    workingSet?: number  // 物理内存使用量
    privateUsage?: number // 私有内存使用量，虚拟内存，优先使用此字段
}

export interface SystemMemoryInfo {
    total?: number; // 总物理内存
    free?: number;  // 可用物理内存
    load?: number; // 已使用物理内存
    totalVirtual?: number;  // 总虚拟内存
}

export interface SystemCpuTimes extends ProcessCpuTimes {
    user: number
    kernel: number
    idle: number; // 空闲时间
}

export type FileDescription = string