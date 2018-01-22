import * as Electron from 'electron'
import { autorun, observable } from 'mobx'
import { actionRegistry } from '../action/Action'
import { menuBarTemplate } from './MenuBarTemplate'

export interface MenuDescription extends Electron.MenuItemConstructorOptions {
  action?: string
  submenu?: MenuDescription[]
}

function menuDescriptionToElectron (description: MenuDescription): Electron.MenuItemConstructorOptions {
  const options: Electron.MenuItemConstructorOptions = {}
  Object.assign(options, description)
  if (description.action) {
    const action = actionRegistry.get(description.action)
    if (action) {
      if (!options.label) {
        options.label = action.title
      }
      options.enabled = action.enabled
      options.click = () => action.run()
      options.accelerator = process.platform === 'darwin' ? action.defaultKeyMac : action.defaultKey
    }
  }
  if (description.submenu) {
    options.submenu = description.submenu.map(menuDescriptionToElectron)
  }
  return options
}

export class MenuBar {
  @observable template: MenuDescription[] = menuBarTemplate

  constructor () {
    autorun(() => {
      this.updateMenu()
    })
    if (process.platform === 'darwin') {
      window.addEventListener('focus', () => {
        this.updateMenu()
      })
    }
  }

  render () {
    return this.template.map(menuDescriptionToElectron)
  }

  updateMenu () {
    const template = this.render()
    const win = Electron.remote.getCurrentWindow()
    if (process.platform === 'darwin') {
      if (win.isFocused()) {
        const menu = Electron.remote.Menu.buildFromTemplate(template)
        Electron.remote.Menu.setApplicationMenu(menu)
      }
    } else {
      const menu = Electron.remote.Menu.buildFromTemplate(template)
      win.setMenu(menu)
    }
  }
}

export const menuBar = new MenuBar()
