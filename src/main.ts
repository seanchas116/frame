import { app, BrowserWindow, ipcMain } from 'electron'
import * as qs from 'querystring'

const argv = require('minimist')(process.argv.slice(2))
const contentBase = argv.devserver ? 'http://localhost:23000' : `file://${app.getAppPath()}/dist`

let mainWindow: BrowserWindow | undefined
let testWindow: BrowserWindow | undefined

async function openWindow (filePath?: string) {
  const win = mainWindow = new BrowserWindow({
    width: 1200,
    height: 768,
    show: false
  })

  const query = qs.stringify({ filePath })

  win.loadURL(`${contentBase}/index.html#${query}`)
  if (argv.devserver) {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    mainWindow = undefined
  })

  win.on('ready-to-show', () => {
    win.show()
  })
}

function openTestWindow () {
  const win = testWindow = new BrowserWindow({
    width: 1200,
    height: 768
  })
  win.loadURL(`${contentBase}/test.html`)
  win.webContents.openDevTools()
  win.on('closed', () => {
    testWindow = undefined
  })
}

app.commandLine.appendSwitch('enable-experimental-web-platform-features')

app.on('ready', async () => {
  if (argv.test) {
    await openTestWindow()
  } else {
    ipcMain.on('newWindow', async (e: Electron.IpcMessageEvent, filePath?: string) => {
      await openWindow(filePath)
    })
    await openWindow()
  }
})
