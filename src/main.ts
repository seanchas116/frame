import { app, BrowserWindow, ipcMain } from 'electron'
import * as qs from 'querystring'

const dev = process.env.NODE_ENV === 'development'
const contentBase = dev ? 'http://localhost:23000' : `file://${app.getAppPath()}/dist`

let mainWindow: BrowserWindow | undefined

async function openWindow (filePath?: string) {
  const win = mainWindow = new BrowserWindow({
    width: 1200,
    height: 768,
    show: false
  })

  const query = qs.stringify({ filePath })

  win.loadURL(`${contentBase}/index.html#${query}`)
  if (dev) {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    mainWindow = undefined
  })

  win.on('ready-to-show', () => {
    win.show()
  })
}

app.commandLine.appendSwitch('enable-experimental-web-platform-features')

app.on('ready', async () => {
  ipcMain.on('newWindow', async (e: Electron.IpcMessageEvent, filePath?: string) => {
    await openWindow(filePath)
  })
  await openWindow()
})
