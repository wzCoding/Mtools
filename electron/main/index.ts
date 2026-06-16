import { app, BrowserWindow, Tray, Menu } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import handleIpcEvents from '../ipc/index.js'

const isDev = process.env.NODE_ENV === 'development'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

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

    console.log('Fetching process information using systeminformation...');

}

function createTray() {
    const tray = new Tray(path.join(__dirname, '../../public/electron.png'))
    const contextMenu = Menu.buildFromTemplate([
        { label: '显示主界面', click: createWindow },
        { label: '退出程序', click: () => { app.quit() } }
    ])
    tray.setToolTip('Mtools')
    tray.setContextMenu(contextMenu)
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