import { observable } from 'mobx'
import { ValueRange } from '../../lib/ValueRange'
import { TextStyle } from './Text'

export class TextSelection {
  @observable range: ValueRange | undefined = undefined
  @observable insertStyle: TextStyle = TextStyle.default

  clear () {
    this.range = undefined
  }
}
