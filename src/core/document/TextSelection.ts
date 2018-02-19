import { observable } from 'mobx'
import { ValueRange } from '../../lib/ValueRange'
import { TextStyle, defaultTextSpan } from './Text'

export class TextSelection {
  @observable range: ValueRange | undefined = undefined
  @observable insertStyle: TextStyle = defaultTextSpan

  clear () {
    this.range = undefined
  }
}
