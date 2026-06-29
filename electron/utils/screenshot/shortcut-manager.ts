/**
 * 全局快捷键管理器
 *
 * 负责：
 *   1. 注册 / 注销全局截图快捷键
 *   2. 持久化快捷键配置到用户目录
 *   3. 处理快捷键触发 → 执行截图 → 通知渲染进程
 */
import { app, globalShortcut, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import { startScreenshot } from './screenshot.js'

// ─── 常量 ───

/** 默认快捷键：Win+Shift+X / Cmd+Shift+X */
const DEFAULT_SHORTCUT = process.platform === 'darwin'
  ? 'Command+Shift+X'
  : 'Super+Shift+X'

const CONFIG_FILENAME = 'screenshot-shortcut.json'

// ─── 状态 ───

/** 当前注册的快捷键 accelerator 字符串 */
let currentAccelerator: string | null = null
/** 通过快捷键触发的最近一次截图结果（供渲染进程取用） */
let lastShortcutResult: { success: boolean; dataUrl?: string; error?: string } | null = null

// ─── 配置持久化 ───

function getConfigPath(): string {
  return path.join(app.getPath('userData'), CONFIG_FILENAME)
}

function loadShortcutConfig(): string {
  try {
    const raw = fs.readFileSync(getConfigPath(), 'utf-8')
    const config = JSON.parse(raw)
    if (typeof config.accelerator === 'string' && config.accelerator.length > 0) {
      return config.accelerator
    }
  } catch {
    // 文件不存在或格式错误，使用默认值
  }
  return DEFAULT_SHORTCUT
}

function saveShortcutConfig(accelerator: string): void {
  fs.writeFileSync(getConfigPath(), JSON.stringify({ accelerator }, null, 2), 'utf-8')
}

// ─── 公共 API ───

/**
 * 初始化：读取已保存的快捷键并注册
 * 应在 app.whenReady() 之后调用
 */
export function initShortcut(mainWindow: BrowserWindow): void {
  const accelerator = loadShortcutConfig()
  register(accelerator, mainWindow)
}

/**
 * 更新快捷键
 * @returns 是否注册成功
 */
export function updateShortcut(accelerator: string, mainWindow: BrowserWindow): boolean {
  unregister()
  const ok = register(accelerator, mainWindow)
  if (ok) {
    saveShortcutConfig(accelerator)
  }
  return ok
}

/** 获取当前快捷键 accelerator 字符串 */
export function getCurrentShortcut(): string {
  return currentAccelerator ?? loadShortcutConfig()
}

/** 获取通过快捷键触发的最近一次截图结果，取后清空 */
export function consumeShortcutResult(): {
  success: boolean
  dataUrl?: string
  error?: string
} | null {
  const result = lastShortcutResult
  lastShortcutResult = null
  return result
}

/** 注销快捷键（app quit 时调用） */
export function unregisterAll(): void {
  unregister()
}

// ─── 内部实现 ───

function register(accelerator: string, mainWindow: BrowserWindow): boolean {
  try {
    const ok = globalShortcut.register(accelerator, () => {
      handleShortcutTrigger(mainWindow)
    })
    if (ok) {
      currentAccelerator = accelerator
      console.log(`[Shortcut] 已注册全局快捷键: ${accelerator}`)
    } else {
      console.warn(`[Shortcut] 快捷键注册失败: ${accelerator}`)
    }
    return ok
  } catch (err) {
    console.error(`[Shortcut] 注册异常:`, err)
    return false
  }
}

function unregister(): void {
  if (currentAccelerator) {
    globalShortcut.unregister(currentAccelerator)
    console.log(`[Shortcut] 已注销: ${currentAccelerator}`)
    currentAccelerator = null
  }
}

/** 全局快捷键被按下时触发 */
async function handleShortcutTrigger(mainWindow: BrowserWindow): Promise<void> {
  console.log('[Shortcut] 快捷键触发，开始截图...')
  try {
    const result = await startScreenshot(mainWindow)
    // 如果是并发拒绝（截图进行中），不通知渲染进程
    if (result.error === '截图进行中，请稍后再试') {
      console.warn('[Shortcut] 截图进行中，忽略重复快捷键')
      return
    }
    lastShortcutResult = result

    // 通知渲染进程导航到截图页面并取结果
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send('screenshot:shortcut-triggered')
      // 确保窗口可见
      if (!mainWindow.isVisible()) {
        mainWindow.show()
      }
      mainWindow.focus()
    }
  } catch (err) {
    console.error('[Shortcut] 截图失败:', err)
  }
}
