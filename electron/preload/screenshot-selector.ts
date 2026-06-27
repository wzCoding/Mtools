/**
 * 截图选区窗口 — preload 脚本
 *
 * 该窗口是一个透明的全屏覆盖窗口，用于：
 *   1. 接收主进程发来的截图图片数据
 *   2. 将用户的选区结果发送回主进程
 *
 * 注意：不要在此 preload 中暴露与主渲染进程无关的 API
 */
import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('selectorApis', {
  /** 监听主进程发来的图片数据 */
  onImageData: (callback: (dataUrl: string) => void) => {
    ipcRenderer.on('screenshot:image-data', (_event, dataUrl: string) => {
      callback(dataUrl)
    })
  },

  /** 提交选区 */
  submitSelection: (rect: { x: number; y: number; width: number; height: number }) => {
    ipcRenderer.send('screenshot:selection-made', rect)
  },

  /** 取消截图 */
  cancelSelection: () => {
    ipcRenderer.send('screenshot:selection-cancel')
  },
})
