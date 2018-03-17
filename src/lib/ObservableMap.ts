import { createAtom } from 'mobx'

export class ObservableMap<K, T> implements Iterable<[K, T]> {
  private atom = createAtom('ObservableMap')
  private map: Map<K, T>

  constructor (pairs?: Iterable<[K, T]>) {
    this.map = new Map(pairs || [])
  }

  set (key: K, value: T) {
    this.map.set(key, value)
    this.atom.reportChanged()
    return this
  }

  clear () {
    this.map.clear()
    this.atom.reportChanged()
  }

  delete (key: K) {
    const deleted = this.map.delete(key)
    this.atom.reportChanged()
    return deleted
  }

  replace (pairs: Iterable<[K, T]>) {
    this.map = new Map(pairs)
    this.atom.reportChanged()
  }

  get (key: K) {
    this.atom.reportObserved()
    return this.map.get(key)
  }

  has (key: K) {
    this.atom.reportObserved()
    return this.map.has(key)
  }

  get size () {
    this.atom.reportObserved()
    return this.map.size
  }

  [Symbol.iterator] () {
    this.atom.reportObserved()
    return this.map[Symbol.iterator]()
  }

  keys () {
    this.atom.reportObserved()
    return this.map.keys()
  }

  values () {
    this.atom.reportObserved()
    return this.map.values()
  }

  peek () {
    this.atom.reportObserved()
    return new Map(this.map)
  }
}
