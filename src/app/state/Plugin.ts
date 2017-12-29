import { Action, actionRegistry } from './Action'

export interface Plugin {
  actions: Action[]
}

export class PluginRegistry {
  _plugins: Plugin[] = []

  get plugins (): ReadonlyArray<Plugin> {
    return this._plugins
  }

  load (plugin: Plugin) {
    this._plugins.push(plugin)
    for (const action of plugin.actions) {
      actionRegistry.add(action)
    }
  }
}

export const pluginRegistry = new PluginRegistry()
