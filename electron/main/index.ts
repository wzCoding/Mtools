import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import handleIpcEvents from '../ipc/index.js'
import i18n from '../utils/i18n.js'

const isDev = process.env.NODE_ENV === 'development'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

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

    if (isDev) {
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
    tray = new Tray(path.join(__dirname, '../../public/electron.png'))
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