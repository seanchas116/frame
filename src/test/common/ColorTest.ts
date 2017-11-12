import { RGBColor } from '../../core/common/Color'
import { assert } from 'chai'

describe('RGBColor', () => {
  let rgb: RGBColor
  before(() => {
    rgb = new RGBColor(10 / 255, 20 / 255, 30 / 255, 0.5)
  })
  describe('toString', () => {
    it('returns RGBA string for CSS', () => {
      const str = rgb.toString()
      assert.equal(str, 'rgba(10,20,30,0.5)')
    })
  })
})
