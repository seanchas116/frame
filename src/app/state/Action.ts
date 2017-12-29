
export interface Action {
  id: string
  title: string
  enabled: boolean
  run (): void
}

export class ActionRegistry {
  private actions = new Map<string, Action>()

  add (action: Action) {
    this.actions.set(action.id, action)
  }

  get (id: string) {
    return this.actions.get(id)
  }
}

export const actionRegistry = new ActionRegistry()
