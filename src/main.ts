import * as Electron from 'electron'
import * as qs from 'querystring'
import * as transparentTitlebar from 'transparent-titlebar'

const argv = require('minimist')(process.argv.slice(2))
const contentBase = argv.devserver ? 'http://localhost:23000' : `file://${Electron.app.getAppPath()}/dist`

class Window {
  static instances = new Set<Window>()

  constructor (public browserWindow: Electron.BrowserWindow) {
    Window.instances.add(this)
    browserWindow.on('closed', () => {
      Window.instances.delete(this)
    })
  }

  static forWebContents (webContents: Electron.WebContents) {
    for (const win of this.instances) {
      if (win.browserWindow.webContents === webContents) {
        return win
      }
    }
  }
}

class DocumentWindow extends Window {

  constructor (public filePath?: string) {
    super(new Electron.BrowserWindow({
      width: 1200,
      height: 768,
      show: false
    }))
    transparentTitlebar.setup(this.browserWindow.getNativeWindowHandle())

    const query = qs.stringify({ filePath })

    this.browserWindow.loadURL(`${contentBase}/index.html#${query}`)

    if (argv.devserver) {
      this.browserWindow.webContents.openDevTools()
    }

    this.browserWindow.on('ready-to-show', () => {
      this.browserWindow.show()
    })
  }

  static forFilePath (path: string) {
    for (const win of Window.instances) {
      if (win instanceof DocumentWindow && win.filePath === path) {
        return win
      }
    }
  }
}

class TestWindow extends Window {
  constructor () {
    super(new Electron.BrowserWindow({
      width: 1200,
      height: 768
    }))
    this.browserWindow.loadURL(`${contentBase}/test.html`)
    this.browserWindow.webContents.openDevTools()
  }
}

Electron.app.commandLine.appendSwitch('enable-experimental-web-platform-features')

Electron.app.on('ready', () => {
  if (argv.test) {
    // tslint:disable-next-line:no-unused-expression
    new TestWindow()
  } else {
    Electron.ipcMain.on('newWindow', async (e: Electron.IpcMessageEvent, filePath?: string) => {
      if (filePath) {
        const win = DocumentWindow.forFilePath(filePath)
        if (win) {
          win.browserWindow.focus()
          return
        }
      }
      // tslint:disable-next-line:no-unused-expression
      new DocumentWindow(filePath)
    })
    Electron.ipcMain.on('filePathChange', async (e: Electron.IpcMessageEvent, filePath?: string) => {
      const win = Window.forWebContents(e.sender)
      if (win instanceof DocumentWindow) {
        win.filePath = filePath
        console.log(filePath)
      }
    })
    // tslint:disable-next-line:no-unused-expression
    new DocumentWindow()
  }
})
