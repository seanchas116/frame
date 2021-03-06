import { observable, computed } from 'mobx'
import { isTextInput } from '../../lib/isTextInput'

export class CurrentFocus {
  @observable element = document.activeElement

  @computed get isTextInput () {
    return isTextInput(this.element)
  }

  constructor () {
    window.addEventListener('focus', this.handleFocusChange, true)
    window.addEventListener('blur', this.handleFocusChange, true)
  }

  private handleFocusChange = () => {
    this.element = document.activeElement
  }
}

export const currentFocus = new CurrentFocus()
