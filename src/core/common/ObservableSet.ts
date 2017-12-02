import { Atom } from 'mobx'

export class ObservableSet<T> implements Iterable<T> {
  private atom = new Atom('ObservableSet')
  private set: Set<T>

  constructor (values?: Iterable<T>) {
    this.set = new Set(values || [])
  }

  add (value: T) {
    this.set.add(value)
    this.atom.reportChanged()
    return this
  }

  clear () {
    this.set.clear()
    this.atom.reportChanged()
  }

  delete (value: T) {
    const deleted = this.set.delete(value)
    this.atom.reportChanged()
    return deleted
  }

  replace (values: Iterable<T>) {
    this.set = new Set(values)
    this.atom.reportChanged()
  }

  has (value: T) {
    this.atom.reportObserved()
    return this.set.has(value)
  }

  get size () {
    this.atom.reportObserved()
    return this.set.size
  }

  [Symbol.iterator] () {
    this.atom.reportObserved()
    return this.set[Symbol.iterator]()
  }

  peek () {
    this.atom.reportObserved()
    return new Set(this.set)
  }
}
