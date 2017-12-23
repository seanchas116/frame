const inputTypes = ['text', 'password', 'number', 'email', 'url', 'search', 'date', 'datetime', 'datetime-local', 'time', 'month', 'week']

export function isTextInput (elem: EventTarget) {
  if (elem instanceof HTMLElement) {
    if (elem.isContentEditable) {
      return true
    }
  }
  if (elem instanceof HTMLTextAreaElement) {
    return true
  }
  if (elem instanceof HTMLInputElement) {
    return inputTypes.includes(elem.type)
  }
  return false
}
