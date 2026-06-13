import { ipcMain, BrowserWindow } from "electron";
import * as os from 'os';
import { getProcesses } from '@native/processesInfo';
import { getProcessMemory, getSystemMemory } from "@native/memoryInfo";
import { getProcessCpuTime, getSystemCpuTimes } from "@native/cpuInfo";
import { getFileDescription } from "@native/descriptionInfo"
import { killProcess } from "@native/killProcess";
import { getAppIconByPath } from "../utils/index";
import { registerInpaintLaMaHandler } from "./ipc-inpaint-lama";

export default function handleIpcEvents(win: BrowserWindow) {
    // 窗口控制
    ipcMain.on('window-minimize', () => {
        win.minimize()
    });

    ipcMain.on('window-maximize', () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    ipcMain.on('window-close', () => {
        win.close()
    });

    // ─── 系统信息 ───
    ipcMain.handle('get-processes', async () => {
        return await getProcesses();
    });

    ipcMain.handle('get-process-memory', (_, pid: number) => {
        return getProcessMemory(pid);
    })

    ipcMain.handle('get-system-memory', () => {
        return getSystemMemory()
    });

    ipcMain.handle('get-process-cpu-times', (_, pid: number) => {
        return getProcessCpuTime(pid);
    })

    ipcMain.handle('get-system-cpu-times', () => {
        return getSystemCpuTimes();
    });

    ipcMain.handle('get-file-description', (_, path: string) => {
        return getFileDescription(path);
    });

    ipcMain.handle('kill-process', (_, pid: number) => {
        return killProcess(pid);
    });

    ipcMain.handle('get-app-icon', (_, appPath: string) => {
        return getAppIconByPath(appPath);
    });

    ipcMain.handle('get-system-uptime', () => {
        return os.uptime();
    });

    // ─── LaMa AI 去水印 ───
    console.log('[LaMa] Registering IPC handler...')
    registerInpaintLaMaHandler(win);
    console.log('[LaMa] IPC handler registered')
}
