import * as util from 'util'

interface DisposableObject {
  dispose (): void
}
type DisposableFunction = () => void

export type Disposable = DisposableObject | DisposableFunction

function isDisposableFunction (d: Disposable): d is DisposableFunction {
  return util.isFunction(d)
}

export function disposeAll (disposables: Disposable[]) {
  for (const d of disposables) {
    isDisposableFunction(d) ? d() : d.dispose()
  }
}
