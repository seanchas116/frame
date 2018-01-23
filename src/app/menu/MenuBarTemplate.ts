import * as Electron from 'electron'
import { MenuDescription } from './MenuBar'
import { fileNew, fileOpen, fileSave, fileSaveAs, editUndo, editRedo, editCut, editCopy, editPaste } from '../ActionIDs'

const fileMenu: MenuDescription = {
  label: 'File',
  submenu: [
    { action: fileNew },
    { action: fileOpen },
    { type: 'separator' },
    { action: fileSave },
    { action: fileSaveAs }
  ]
}

const editMenu: MenuDescription = {
  label: 'Edit',
  submenu: [
    { action: editUndo },
    { action: editRedo },
    { type: 'separator' },
    { action: editCut },
    { action: editCopy },
    { action: editPaste },
    { role: 'delete' },
    { role: 'selectall' }
  ]
}

const layerMenu: MenuDescription = {
  label: 'Layer',
  submenu: [
    { action: 'layer.group', accelerator: 'CommandOrControl+G' },
    { action: 'layer.ungroup', accelerator: 'Shift+CommandOrControl+G' }
  ]
}
const viewMenu: MenuDescription = {
  label: 'View',
  submenu: [
    { role: 'reload' },
    { role: 'forcereload' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ]
}
const windowMenu: MenuDescription = {
  role: 'window',
  submenu: [
    { role: 'minimize' },
    { role: 'close' }
  ]
}
const helpMenu: MenuDescription = {
  role: 'help',
  submenu: [
    {
      label: 'Learn More',
      click () { require('electron').shell.openExternal('https://electron.atom.io') }
    }
  ]
}

export const menuBarTemplate = [fileMenu, editMenu, layerMenu, viewMenu, windowMenu, helpMenu]

if (process.platform === 'darwin') {
  const appMenu: MenuDescription = {
    label: Electron.remote.app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }
  menuBarTemplate.unshift(appMenu)

  editMenu.submenu![1].accelerator = 'Shift+CommandOrControl+Z'
  editMenu.submenu!.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    }
  )

  windowMenu.submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ]
}
