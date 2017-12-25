import { observable, action, computed } from 'mobx'

export interface UndoCommand {
  undo (): void
  redo (): void
}

export class UndoStack<T extends UndoCommand> {
  private readonly commands = observable<T>([])
  @observable private doneCount = 0

  @computed get commandToUndo () {
    if (this.canUndo) {
      return this.commands[this.doneCount - 1]
    }
  }
  @computed get commandToRedo () {
    if (this.canRedo) {
      return this.commands[this.doneCount]
    }
  }

  @computed get canUndo () {
    return 0 < this.doneCount
  }

  @computed get canRedo () {
    return this.doneCount < this.commands.length
  }

  @action push (command: T) {
    if (this.canRedo) {
      this.commands.replace(this.commands.slice(0, this.doneCount))
    }
    this.commands.push(command)
    this.doneCount = this.commands.length
  }

  @action undo () {
    if (!this.canUndo) {
      return
    }
    --this.doneCount
    this.commands[this.doneCount].undo()
  }

  @action redo () {
    if (!this.canRedo) {
      return
    }
    this.commands[this.doneCount].redo()
    ++this.doneCount
  }
}
