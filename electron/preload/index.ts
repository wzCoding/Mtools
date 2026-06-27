const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("bridgeApis", {
    // ─── 窗口控制 ───
    maximize: () => ipcRenderer.send("window-maximize"),
    minimize: () => ipcRenderer.send("window-minimize"),
    close: () => ipcRenderer.send("window-close"),

    // ─── 系统信息 ───
    getProcesses: () => ipcRenderer.invoke("get-processes"),
    getProcessMemory: (pid:number) => ipcRenderer.invoke("get-process-memory", pid),
    getSystemMemory: () => ipcRenderer.invoke("get-system-memory"),
    getProcessCpuTimes: (pid:number) => ipcRenderer.invoke("get-process-cpu-times", pid),
    getSystemCpuTimes: () => ipcRenderer.invoke("get-system-cpu-times"),
    getFileDescription: (path:string) => ipcRenderer.invoke("get-file-description", path),
    getAppIcon: (appPath: string) => ipcRenderer.invoke("get-app-icon", appPath),
    killProcess: (pid: number) => ipcRenderer.invoke("kill-process", pid),
    getSystemUptime: () => ipcRenderer.invoke("get-system-uptime"),
    inpaintLaMa: (imageBuffer: ArrayBuffer, maskBuffer: ArrayBuffer) =>
        ipcRenderer.invoke("inpaint:lama", {
            imageBuffer,
            maskBuffer,
        }),

    // ─── 截图 ───
    captureScreen: () => ipcRenderer.invoke("screenshot:capture"),
    copyScreenshotToClipboard: (dataUrl: string) =>
        ipcRenderer.invoke("screenshot:copy-to-clipboard", dataUrl),
    saveScreenshotToFile: (dataUrl: string) =>
        ipcRenderer.invoke("screenshot:save-to-file", dataUrl),

    // ─── 截图快捷键 ───
    getScreenshotShortcut: () => ipcRenderer.invoke("screenshot:get-shortcut"),
    setScreenshotShortcut: (accelerator: string) =>
        ipcRenderer.invoke("screenshot:set-shortcut", accelerator),
    getShortcutScreenshotResult: () => ipcRenderer.invoke("screenshot:get-shortcut-result"),
    /** 监听全局快捷键触发（主进程 → 渲染进程） */
    onScreenshotShortcutTriggered: (callback: () => void) => {
        ipcRenderer.on("screenshot:shortcut-triggered", () => callback())
    },

    // ─── 语言切换 ───
    changeLanguage: (lang: string) => ipcRenderer.send("change-language", lang),
});
