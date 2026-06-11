const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("bridgeApis", {
    maximize: () => ipcRenderer.send("window-maximize"),
    minimize: () => ipcRenderer.send("window-minimize"),
    close: () => ipcRenderer.send("window-close"),
    getProcesses: () => ipcRenderer.invoke("get-processes"),
    getProcessMemory: (pid:number) => ipcRenderer.invoke("get-process-memory", pid),
    getSystemMemory: () => ipcRenderer.invoke("get-system-memory"),
    getProcessCpuTimes: (pid:number) => ipcRenderer.invoke("get-process-cpu-times", pid),
    getSystemCpuTimes: () => ipcRenderer.invoke("get-system-cpu-times"),
    getFileDescription: (path:string) => ipcRenderer.invoke("get-file-description", path),
    getAppIcon: (appPath: string) => ipcRenderer.invoke("get-app-icon", appPath),
    killProcess: (pid: number) => ipcRenderer.invoke("kill-process", pid),
    getSystemUptime: () => ipcRenderer.invoke("get-system-uptime"),
});
