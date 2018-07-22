import { observable } from 'mobx'
import { ValueRange } from '../../lib/ValueRange'
import { AttributedTextStyle } from './AttributedText'

export class TextSelection {
  @observable range: ValueRange | undefined = undefined
  @observable insertStyle: AttributedTextStyle = AttributedTextStyle.default

  clear () {
    this.range = undefined
  }
}
