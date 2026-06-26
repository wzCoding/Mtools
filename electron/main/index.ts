import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import handleIpcEvents from '../ipc/index.js'
import i18n from '../utils/i18n.js'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
const debug = false

function resolveAssetPath(relativePath: string): string {
    if (isDev) {
        // 开发环境：相对于项目根目录的 public/
        return path.join(__dirname, '../../public', relativePath)
    }
    // 生产环境：extraResources 中的文件在 resources/ 目录下
    return path.join(process.resourcesPath, relativePath)
}

let tray: Tray | null = null

function buildTrayMenu() {
    return Menu.buildFromTemplate([
        { label: i18n.t('show-main-window'), click: createWindow },
        { label: i18n.t('quit-app'), click: () => { app.quit() } }
    ])
}

function refreshTrayMenu() {
    if (!tray) return
    tray.setContextMenu(buildTrayMenu())
}

function createWindow() {
    if (BrowserWindow.getAllWindows().length > 0) {
        BrowserWindow.getAllWindows()[0].show();
        return;
    }
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        frame: false,
        titleBarStyle: 'hidden',
        icon: resolveAssetPath('tools.ico'),
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL!)
    } else {
        win.loadFile(path.join(__dirname, '../../dist/index.html'))
    }

    if (isDev && debug) {
        win.webContents.openDevTools()
    }

    createTray()
    handleIpcEvents(win)

    // 监听渲染进程语言切换
    ipcMain.on('change-language', (_event, lang: string) => {
        i18n.changeLanguage(lang)
        refreshTrayMenu()
    })

    console.log('Fetching process information using systeminformation...');

}

function createTray() {
    tray = new Tray(resolveAssetPath('tools.ico'))
    tray.setToolTip('Mtools')
    tray.setContextMenu(buildTrayMenu())
}

app.whenReady().then(() => {
    createWindow()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})