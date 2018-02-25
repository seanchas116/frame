import { observable } from 'mobx'
import { ValueRange } from '../../lib/ValueRange'
import { TextStyle, defaultTextStyle } from './Text'

export class TextSelection {
  @observable range: ValueRange | undefined = undefined
  @observable insertStyle: TextStyle = defaultTextStyle

  clear () {
    this.range = undefined
  }
}
