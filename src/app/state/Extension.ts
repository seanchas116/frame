import { Action, actionRegistry } from './Action'

export interface Extension {
  actions: Action[]
}

export class ExtensionRegistry {
  _extensions: Extension[] = []

  get extensions (): ReadonlyArray<Extension> {
    return this._extensions
  }

  add (extension: Extension) {
    this._extensions.push(extension)
    for (const action of extension.actions) {
      actionRegistry.add(action)
    }
  }
}

export const extensionRegistry = new ExtensionRegistry()
