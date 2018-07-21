import { observable, toJS, computed } from 'mobx'

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

interface FontFamily {
  name: string
  fonts: FontInfo[]
}

export class FontRegistry {
  private fontManager = require('font-manager')
  readonly fonts = observable<FontInfo>([])

  @computed families () {
    const families = new Map<string, FontFamily>()
    for (const font of this.fonts) {
      let family = families.get(font.family) || (() => {
        const family: FontFamily = { name: font.family, fonts: [] }
        families.set(font.family, family)
        return family
      })()
      family.fonts.push(font)
    }
    return families
  }

  constructor () {
    this.fonts.replace(this.fontManager.getAvailableFontsSync()) // FIXME: getAvailableFontsSync is very slow
    console.log(toJS(this.fonts))
  }
}

export const fontRegistry = new FontRegistry()
