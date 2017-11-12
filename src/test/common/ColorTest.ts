import { RGBColor, HSVColor } from '../../core/common/Color'
import { assert } from 'chai'

describe('RGBColor', () => {
  describe('toString', () => {
    it('returns RGBA string for CSS', () => {
      const rgb = new RGBColor(10 / 255, 20 / 255, 30 / 255, 0.5)
      const str = rgb.toString()
      assert.equal(str, 'rgba(10,20,30,0.5)')
    })
  })
  describe('toHSV', () => {
    it('converts color to HSVColor', () => {
      const rgb = new RGBColor(0, 1, 0, 0.5)
      const hsv = rgb.toHSV()
      assert.deepEqual(hsv, new HSVColor(120, 1, 1, 0.5))
    })
  })
  describe('equals', () => {
    it('compares 2 colors', () => {
      assert(new RGBColor(0.1, 0.2, 0.3, 0.4).equals(new RGBColor(0.1, 0.2, 0.3, 0.4)))
      assert(!new RGBColor(0.1, 0.2, 0.3, 0.4).equals(new RGBColor(0.2, 0.1, 0.4, 0.3)))
    })
  })
})
describe('HSVColor', () => {
  describe('toRGB', () => {
    it('converts color to RGBColor', () => {
      const hsv = new HSVColor(180, 1, 1, 0.5)
      const rgb = hsv.toRGB()
      assert.deepEqual(rgb, new RGBColor(0, 1, 1, 0.5))
    })
  })
  describe('equals', () => {
    it('compares 2 colors', () => {
      assert(new HSVColor(0.1, 0.2, 0.3, 0.4).equals(new HSVColor(0.1, 0.2, 0.3, 0.4)))
      assert(!new HSVColor(0.1, 0.2, 0.3, 0.4).equals(new HSVColor(0.2, 0.1, 0.4, 0.3)))
    })
  })
})
