import { observable, toJS } from 'mobx'

interface FontInfo {
  path: string
  postscriptName: string
  family: string
  style: string
  weight: number
  width: number
  italic: boolean
  monospace: boolean
}

export class FontRegistry {
  private fontManager = require('font-manager')
  readonly fonts = observable<FontInfo>([])

  constructor () {
    this.fonts.replace(this.fontManager.getAvailableFontsSync())
    console.log(toJS(this.fonts))
  }
}

export const fontRegistry = new FontRegistry()
