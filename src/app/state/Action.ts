
export interface IAction {
  id: string
  title: string
  enabled: boolean
  run (): void
}

export class ActionRegistry {
  private actions = new Map<string, IAction>()

  add (action: IAction) {
    this.actions.set(action.id, action)
  }

  get (id: string) {
    return this.actions.get(id)
  }
}

export const actionRegistry = new ActionRegistry()
