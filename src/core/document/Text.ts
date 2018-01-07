import { observable } from 'mobx'
import { HSVColor } from '../common/Color'

export class Text {
  @observable fontFamily: string | undefined = undefined
  @observable fontSize : number | undefined = undefined
  @observable fontWeight: number | undefined = undefined
  @observable color: HSVColor | undefined = undefined
  readonly children = observable<Text | string>([])
}
