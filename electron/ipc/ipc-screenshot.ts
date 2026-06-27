/**
 * 截图功能 — IPC 处理器
 *
 * 在主进程注册与截图相关的 IPC 通道。
 */
import { BrowserWindow, ipcMain, clipboard, nativeImage, dialog } from 'electron'
import fs from 'fs'
import { startScreenshot } from '../utils/screenshot.js'
import {
  getCurrentShortcut,
  updateShortcut,
  consumeShortcutResult,
} from '../utils/shortcut-manager.js'

/**
 * 注册截图相关的 IPC handler
 * @param win 主应用窗口
 */
export function registerScreenshotHandlers(win: BrowserWindow): void {
  // ─── 启动截图流程 ───
  ipcMain.handle('screenshot:capture', async () => {
    const result = await startScreenshot(win)
    return result
  })

  // ─── 复制图片到剪贴板 ───
  ipcMain.handle('screenshot:copy-to-clipboard', async (_event, dataUrl: string) => {
    try {
      const img = nativeImage.createFromDataURL(dataUrl)
      clipboard.writeImage(img)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  })

  // ─── 保存截图到文件 ───
  ipcMain.handle('screenshot:save-to-file', async (_event, dataUrl: string) => {
    try {
      const result = await dialog.showSaveDialog(win, {
        title: '保存截图',
        defaultPath: `screenshot_${Date.now()}.png`,
        filters: [{ name: 'PNG 图片', extensions: ['png'] }],
      })

      if (result.canceled || !result.filePath) {
        return { success: false, error: '用户取消保存' }
      }

      // 将 data URL 转为 Buffer 写入文件
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      fs.writeFileSync(result.filePath, buffer)

      return { success: true, filePath: result.filePath }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  })

  // ─── 快捷键管理 ───
  ipcMain.handle('screenshot:get-shortcut', () => {
    return getCurrentShortcut()
  })

  ipcMain.handle('screenshot:set-shortcut', (_event, accelerator: string) => {
    return updateShortcut(accelerator, win)
  })

  ipcMain.handle('screenshot:get-shortcut-result', () => {
    return consumeShortcutResult()
  })
}
