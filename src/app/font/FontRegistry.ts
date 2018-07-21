import { sortBy } from 'lodash'
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
  styles: Map<string, number> // style name => weight
}

export class FontRegistry {
  private fontManager = require('font-manager')
  readonly fonts = observable<FontInfo>([])

  @computed get families () {
    const families = new Map<string, FontFamily>()
    const fonts = sortBy(this.fonts, font => font.family)
    for (const font of fonts) {
      let family = families.get(font.family) || (() => {
        const family: FontFamily = { name: font.family, fonts: [], styles: new Map() }
        families.set(font.family, family)
        return family
      })()
      family.fonts.push(font)
    }
    for (const family of families.values()) {
      const fonts = sortBy(family.fonts, font => font.weight)
      for (const font of fonts) {
        if (!font.italic) {
          family.styles.set(font.style, font.weight)
        }
      }
    }
    return families
  }

  constructor () {
    this.fonts.replace(this.fontManager.getAvailableFontsSync()) // FIXME: getAvailableFontsSync is very slow
    console.log(toJS(this.fonts))
  }
}

export const fontRegistry = new FontRegistry()
