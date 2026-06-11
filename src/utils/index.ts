import type { TableColumn, ProcessInfo, Position, FileCacheData, dataObj, ProcessInfoAlias } from '@/type/index'
import type { SystemCpuTimes } from 'global'
import React from 'react'
import { Tooltip, ConfigProvider } from 'antd'

const fileDescription: FileCacheData = new Map<string, { icon: string, description: string }>()

const processWhiteList = ['svchost.exe', 'conhost.exe', 'RuntimeBroker.exe', 'csrss.exe', 'lsass.exe', 'wininit.exe', 'services.exe', 'smss.exe']

// 持久化：记录每个进程的上次原始 CPU 时间 (毫秒) 和上次系统 CPU 时间
const lastProcessCpuTimeMap = new Map<number, number>();
let lastSystemCpuTimes: SystemCpuTimes = {
    user: 0,
    kernel: 0,
    idle: 0
}

// 系统总 CPU 使用率的独立追踪（与进程级计算解耦）
let lastSystemTotalForCard = 0;
let lastSystemIdleForCard = 0;

const getSystemCpuUsage = (systemCpuTimes: SystemCpuTimes): number => {
    // kernel 已内嵌 idle，total = kernel + user（idle 只被计一次）
    const currentTotal = systemCpuTimes.kernel + systemCpuTimes.user;
    const currentIdle = systemCpuTimes.idle;

    const deltaTotal = currentTotal - lastSystemTotalForCard;
    const deltaIdle = currentIdle - lastSystemIdleForCard;

    lastSystemTotalForCard = currentTotal;
    lastSystemIdleForCard = currentIdle;

    if (deltaTotal <= 0) return 0;
    const usage = ((deltaTotal - deltaIdle) / deltaTotal) * 100;
    return isNaN(usage) || usage < 0 ? 0 : Math.min(usage, 100);
}

/** 格式化系统运行时长 */
const formatUptime = (seconds: number): string => {
    if (seconds <= 0) return '0s';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}min`;
    return `${m}m`;
}

/** 格式化内存大小（字节 → 可读字符串） */
const formatMemory = (bytes: number): string => {
    if (bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(i >= 2 ? 1 : 0)} ${units[i]}`;
}

const computedCpuUsage = (
    pid: number,
    processCpuTimes: number,
    deltaSystemCpuTimes: number
): number => {
    const lastProcessCpuTime = lastProcessCpuTimeMap.get(pid) ?? processCpuTimes;
    const deltaProcessCpuTimes = processCpuTimes - lastProcessCpuTime;

    // 更新该进程的上次 CPU 时间
    lastProcessCpuTimeMap.set(pid, processCpuTimes);

    const usage = deltaSystemCpuTimes > 0
        ? (deltaProcessCpuTimes / deltaSystemCpuTimes) * 100
        : 0;
    return isNaN(usage) || usage < 0 ? 0 : usage;
}

const dataProcessing = (data: ProcessInfo): ProcessInfoAlias => {
    return {
        ...data,
        typeAlias: data.type === 'app' ? '应用' : '后台程序',
        cpuAlias: data.cpu ? `${formatDecimal(data.cpu)}%` : '0%',
        memoryAlias: data.memory ? `${formatDecimal(data.memory)} MB` : '0 MB',
    } as ProcessInfoAlias
}


const setProcessGroup = (p: ProcessInfo, prefix: string, isGroup: boolean, level?: number): ProcessInfo => {
    return {
        ...p,
        description: (p.description || p.name).replace('.exe', ''),
        id: `${prefix}-${p.id}`,
        isGroup,
        level
    }
}

const handleProcessesGroup = async (list: ProcessInfo[]): Promise<ProcessInfo[]> => {
    const groups = new Map<string, ProcessInfo>();
    const isolatedItems: ProcessInfo[] = [];
    const systemCpuTimes = await window.bridgeApis.getSystemCpuTimes(); // 获取系统 CPU 时间（毫秒）

    // Windows GetSystemTimes: kernel 时间已包含 idle，total = kernel + user
    const currentSystemTotal = systemCpuTimes.kernel + systemCpuTimes.user;
    const lastSystemTotal = lastSystemCpuTimes.kernel + lastSystemCpuTimes.user;
    const deltaSystemCpuTimes = currentSystemTotal - lastSystemTotal;
    // 在循环结束后再更新 lastSystemCpuTimes

    const appNames = new Set<string>();

    for (let i = 0; i < list.length; i++) {
        const p = list[i];
        // 获取内存信息
        const { workingSet } = await window.bridgeApis.getProcessMemory(p.pid!);
        const processCpuTimes = await window.bridgeApis.getProcessCpuTimes(p.pid!) || 0;

        if (!fileDescription.has(p.name as string)) {
            const fileCache = {
                description: p.path ? await window.bridgeApis.getFileDescription(p.path) : p.name,
                icon: await window.bridgeApis.getAppIcon(p.path || '')
            }
            fileDescription.set(p.name as string, fileCache);
        }
        p.icon = fileDescription.get(p.name as string)?.icon;
        p.description = fileDescription.get(p.name as string)?.description;
        p.memory = Number(((workingSet as number) / 1024 / 1024).toFixed(2)); // 转为 MB
        p.cpu = computedCpuUsage(p.pid!, processCpuTimes, deltaSystemCpuTimes);
        p.action = '结束进程';
        p.id = `${p.pid}-${i}`;
        p.level = 0

        if (p.type === 'app') {
            appNames.add(p.name);

            if (!groups.has(p.name)) {
                const group = setProcessGroup(p, 'group', true);
                group.children = [];
                groups.set(p.name, group);
            }
            // 把自己加进去
            const g: ProcessInfo = groups.get(p.name)!;
            g.children!.push(setProcessGroup(p, 'children', true, 1));
            g.memory! += p.memory ?? 0;
        }
    }

    // 2. 第二遍扫描：处理 "Background" 进程
    for (const p of list) {
        if (p.type === 'app') continue; // 已经在上面处理过了

        // 逻辑 A: 如果它是“系统隔离进程” (如 svchost)，直接独立，不分组
        if (processWhiteList.includes(p.name)) {
            const bgProcess = setProcessGroup(p, 'proc', false);
            bgProcess.children = [setProcessGroup(p, 'children', false, 1)];
            isolatedItems.push(bgProcess);
            continue;
        }

        // 逻辑 B: 如果它有一个同名的 "App" 大哥，就被大哥收编
        if (groups.has(p.name)) {
            const g: ProcessInfo = groups.get(p.name)!;
            g.children!.push(setProcessGroup(p, 'children', false, 1));
            g.memory! += p.memory ?? 0;
            continue;
        }

        // 逻辑 C: 它是普通的后台进程 (如 node.exe)，按名字聚合
        // 注意：任务管理器后台进程也会折叠
        const bgKey = `bg-${p.name}`;
        if (!groups.has(bgKey)) {
            const group = setProcessGroup(p, bgKey, true);
            group.children = [];
            groups.set(bgKey, group);
        }
        const g: ProcessInfo = groups.get(bgKey)!;
        g.children!.push(setProcessGroup(p, `children`, false, 1));
        g.memory! += p.memory ?? 0;
    }

    // 所有进程处理完毕，更新模块级 lastSystemCpuTimes（只更新一次，避免每进程覆盖）
    lastSystemCpuTimes = systemCpuTimes;

    // 3. 整理结果
    let finalResult = [
        ...Array.from(groups.values()),
        ...isolatedItems
    ];

    // 任务管理器通常：Apps 即使只有1个也占一行；Background 只有1个就不显示折叠箭头
    finalResult.forEach(g => {
        if (g.children!.length <= 1) {
            g.isGroup = false;
        }
    });

    finalResult.sort((a, b) => {
        if (a.type === 'app' && b.type !== 'app') return -1;
        if (a.type !== 'app' && b.type === 'app') return 1;
        // 同类按内存倒序
        return (b.memory ?? 0) - (a.memory ?? 0);
    });

    return finalResult;
}

const createIconColumn = (key: string, value: string, column: ProcessInfo) => {
    const iconElements = [
        React.createElement('img', { src: column.icon, key: `${column.id}-icon`, style: { width: 16, height: 16, marginRight: 8, position: 'relative', top: 2 } }),
        React.createElement('span', { key: `${column.id}-text` }, value)
    ]

    return value.length > 18 ? React.createElement(ConfigProvider, { tooltip: { unique: true } },
        React.createElement(Tooltip, { title: value }, key === 'description' ? iconElements : value)) :
        React.createElement('div', null, key === 'description' ? iconElements : value)
}


const handleTableColumns = (columns: dataObj, showLength: number): TableColumn[] => {
    const list = Object.entries(columns).map(([key, value], index) => {
        const column: TableColumn = {
            title: value as string,
            dataIndex: key,
            key: key,
            hidden: index >= showLength,
            align: 'center',
            width: 'auto',
            ellipsis: { showTitle: false },
        }
        if (['description', 'name'].includes(key)) {
            column.align = key === 'description' ? 'left' : 'center';
            column.render = (value: string, record: ProcessInfo) => {
                return createIconColumn(key, value, record);
            }
        }

        if (key === 'memory') {
            column.render = (value: number) => {
                return React.createElement('span', { title: `${value}` }, value > 0 ? `${value.toFixed(1)} MB` : value)
            }
        }

        if (key === 'cpu') {
            column.render = (value: number) => {
                return React.createElement('span', { title: `${value}` }, `${value.toFixed(1)}%`)
            }
        }

        if (key === 'type') {
            column.render = (value: string) => {
                const color = value === 'app' ? 'var(--success-color)' : 'var(--text-muted)';
                const text = value === 'app' ? '应用' : '后台程序';
                return React.createElement('span', { style: { color } }, text)
            }
        }
        return column;
    })


    return list
}

const formatSize = (value: number | string): number | string => {
    if (typeof value === "number") {
        return value >= 0 ? value : 0;
    }

    if (typeof value === "string") {
        const v = value.trim();

        // 合法 CSS 单位
        const cssUnits = ["px", "em", "rem", "%", "vh", "vw", "vmin", "vmax", "pt", "cm", "mm", "in"];

        for (const unit of cssUnits) {
            if (v.endsWith(unit)) {
                const num = parseFloat(v.slice(0, -unit.length));
                return isFinite(num) ? v : 0;
            }
        }

        const num = Number(v);
        if (!isNaN(num) && isFinite(num) && num >= 0) {
            return num;
        }

        return 0;
    }

    return 0;
}

const computedPosition = (
    targetEl: HTMLElement,
    x: number,
    y: number,
    container?: HTMLElement,
): Position => {
    const rect = targetEl.getBoundingClientRect();
    const containerWidth = container ? container.clientWidth : document.body.clientWidth;
    const containerHeight = container ? container.clientHeight : document.body.clientHeight;
    const menuWidth = rect.width;
    const menuHeight = rect.height;

    let newX = x;
    let newY = y;

    if (x + menuWidth > containerWidth) {
        newX = containerWidth - menuWidth;
    }

    if (y + menuHeight > containerHeight) {
        newY = containerHeight - menuHeight;
    }

    return { x: newX, y: newY };
}

// 节流配置项类型
type ThrottleOptions = {
    leading?: boolean   // 是否在开始时立即执行一次（默认 true）
    trailing?: boolean  // 是否在结束时再执行一次（默认 true）
}

// 泛型 T 表示传入的函数类型，保持参数与返回值类型不变
function throttle<T extends (...args: any[]) => any>(
    fn: T,              // 需要被节流的函数
    wait: number,       // 节流间隔时间
    options: ThrottleOptions = {}
) {
    // 定时器 ID，用于 trailing 调用
    let timer: ReturnType<typeof setTimeout> | null = null

    // 记录最后一次调用时的参数和 this
    let lastArgs: any[] | null = null
    let lastThis: any = null

    // 上一次真正执行 fn 的时间戳
    let lastCallTime = 0

    // 默认 leading = true, trailing = true
    const { leading = true, trailing = true } = options

    // 真正执行 fn 的函数
    const invoke = () => {
        fn.apply(lastThis, lastArgs!)
        lastArgs = null
        lastThis = null
        lastCallTime = Date.now() // 更新执行时间
    }

    // 返回的节流函数
    const throttled = function (this: any, ...args: any[]) {
        const now = Date.now()

        // 如果禁用 leading，则第一次调用不立即执行
        if (!lastCallTime && !leading) {
            lastCallTime = now
        }

        // 距离下次允许执行的剩余时间
        const remaining = wait - (now - lastCallTime)

        // 记录本次调用的参数和 this
        lastArgs = args
        lastThis = this

        // remaining <= 0 表示可以立即执行
        // remaining > wait 表示系统时间被修改（例如手动调整时间）
        if (remaining <= 0 || remaining > wait) {
            // 如果有 trailing 定时器，清除它
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            invoke()
        }
        // 否则，如果允许 trailing 且没有定时器，则设置一个定时器
        else if (!timer && trailing) {
            timer = setTimeout(() => {
                timer = null
                invoke()
            }, remaining)
        }
    } as T & { cancel: () => void }

    // 提供取消节流的能力
    throttled.cancel = () => {
        if (timer) clearTimeout(timer)
        timer = null
        lastArgs = null
        lastThis = null
        lastCallTime = 0
    }

    return throttled
}

function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait: number
) {
    // 定时器 ID，用于控制延迟执行
    let timer: ReturnType<typeof setTimeout> | null = null

    // 返回一个新的函数（保持原函数的参数类型）
    return function (this: any, ...args: Parameters<T>) {
        // 如果已有定时器，清除它（重置计时）
        if (timer) {
            clearTimeout(timer)
        }

        // 重新设置定时器，wait 毫秒后执行 fn
        timer = setTimeout(() => {
            fn.apply(this, args) // 保留 this 和参数
            timer = null         // 执行后清空定时器
        }, wait)
    } as T
}

function rafThrottle<T extends (...args: any[]) => any>(fn: T) {
    // 标记当前是否已经在等待下一帧
    let ticking = false

    // 缓存最新一次调用的参数和 this
    let lastArgs: Parameters<T> | null = null
    let lastThis: any = null

    // 返回节流后的函数
    return function (this: any, ...args: Parameters<T>) {
        lastArgs = args
        lastThis = this

        // 如果当前没有等待下一帧，则创建一个 requestAnimationFrame
        if (!ticking) {
            ticking = true

            requestAnimationFrame(() => {
                ticking = false
                fn.apply(lastThis, lastArgs!)
            })
        }
    } as T
}

function deepClone<T>(target: T, hash = new WeakMap()): T {
    // 1. 优先使用原生 API
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(target);
        } catch (e) {
            // 如果遇到 structuredClone 不支持的特殊对象，降级到手动递归
            console.warn('structuredClone failed, falling back to recursive clone', e);
        }
    }

    // 2. 递归降级实现
    // 处理基本类型和 null
    if (target === null || typeof target !== 'object') {
        return target;
    }

    // 防止循环引用
    if (hash.has(target)) {
        return hash.get(target);
    }

    // 处理 Date
    if (target instanceof Date) return new Date(target) as any;
    // 处理 RegExp
    if (target instanceof RegExp) return new RegExp(target) as any;

    // 初始化克隆对象 (保留原型链)
    const clone: any = Array.isArray(target)
        ? []
        : Object.create(Object.getPrototypeOf(target));

    hash.set(target, clone);

    // 递归处理所有属性
    for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            clone[key] = deepClone(target[key], hash);
        }
    }

    return clone;
}

function formatDecimal(num: any, decimals = 2, returnString = false): number | string {
    // 1. 转换为数字
    let value = parseFloat(num);

    // 2. 无效值处理
    if (isNaN(value)) {
        const zeroStr = '0.' + '0'.repeat(decimals);
        return returnString ? zeroStr : 0;
    }

    // 3. 使用 toFixed 进行四舍五入（自动处理浮点数精度问题）
    const roundedStr = value.toFixed(decimals);

    // 4. 根据参数返回相应类型
    if (returnString) {
        return roundedStr;
    }
    return parseFloat(roundedStr);
}

const sanitizeSearchInput = (value: string): string => {
    if (!value || typeof value !== 'string') return ''

    // 1. 截断超长输入（最大 100 字符）
    const maxLength = 100
    let sanitized = value.slice(0, maxLength)

    // 2. 移除正则表达式特殊字符
    sanitized = sanitized.replace(/[\\^$.*+?()[\]{}|]/g, '')

    // 3. 移除不可见控制字符（保留空格）
    sanitized = sanitized.replace(/[\x00-\x1f\x7f]/g, '')

    // 4. 去除首尾空格
    return sanitized.trim()
}

const getDataFingerprint = (list: ProcessInfo[]): string => {
    if (!list || list.length === 0) return '0'

    let totalMemory = 0
    const pidSample: number[] = []

    for (let i = 0; i < list.length; i++) {
        totalMemory += list[i].memory ?? 0
        // 采样首尾 + 中间位置的 PID 作为特征
        if (i === 0 || i === list.length - 1 || i === Math.floor(list.length / 2)) {
            pidSample.push(list[i].pid ?? 0)
        }
    }

    return `${list.length}_${pidSample.join('_')}_${totalMemory.toFixed(0)}`
}

export {
    handleProcessesGroup,
    handleTableColumns,
    formatSize,
    computedPosition,
    throttle,
    debounce,
    rafThrottle,
    deepClone,
    formatDecimal,
    dataProcessing,
    sanitizeSearchInput,
    getDataFingerprint,
    getSystemCpuUsage,
    formatUptime,
    formatMemory
}