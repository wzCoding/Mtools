import { ipcMain, BrowserWindow } from "electron";
import * as os from 'os';
import { getProcesses } from '@native/processesInfo';
import { getProcessMemory, getSystemMemory } from "@native/memoryInfo";
import { getProcessCpuTime, getSystemCpuTimes } from "@native/cpuInfo";
import { getFileDescription } from "@native/descriptionInfo"
import { killProcess } from "@native/killProcess";
import { getAppIconByPath } from "../utils/index";

export default function handleIpcEvents(win: BrowserWindow) {
    // Handle IPC events 
    // 最小化窗口
    ipcMain.on('window-minimize', () => {
        win.minimize()
    });

    // 最大化或还原窗口
    ipcMain.on('window-maximize', () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    // 关闭窗口
    ipcMain.on('window-close', () => {
        win.close()
    });

    ipcMain.handle('get-processes', async () => {
        const processes = await getProcesses();
        return processes;
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
        return os.uptime(); // 返回系统运行秒数
    });
}
