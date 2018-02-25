import { assert } from 'chai'
import { toJS } from 'mobx'
import { Text, defaultTextStyle } from './Text'
import { ValueRange } from '../../lib/ValueRange'

describe('Text', () => {
  let text: Text
  beforeEach(() => {
    text = new Text()
    text.spans.replace([
      { ...defaultTextStyle, weight: 300, content: 'Foo' },
      { ...defaultTextStyle, weight: 200, size: 14, content: 'Bar' },
      { ...defaultTextStyle, weight: 400, size: 8, content: 'Baz' },
      { ...defaultTextStyle, weight: 500, size: 20, content: 'Hoge' },
      { ...defaultTextStyle, weight: 100, size: 40, content: 'Poyo' }
    ])
  })

  describe('#setStyle', () => {
    it('sets style for span', () => {
      const style = { size: 100 }
      const range = new ValueRange(5, 10)
      text.setStyle(range, style)

      const expected = [
        { ...defaultTextStyle, weight: 300, content: 'Foo' },
        { ...defaultTextStyle, weight: 200, size: 14, content: 'Ba' },
        { ...defaultTextStyle, weight: 200, size: 100, content: 'r' },
        { ...defaultTextStyle, weight: 400, size: 100, content: 'Baz' },
        { ...defaultTextStyle, weight: 500, size: 100, content: 'H' },
        { ...defaultTextStyle, weight: 500, size: 20, content: 'oge' },
        { ...defaultTextStyle, weight: 100, size: 40, content: 'Poyo' }
      ]
      assert.deepEqual(toJS(text.spans), expected)
    })
  })

  describe('#shrink', () => {
    it('merges adjacent spans with same style', () => {
      const original = [
        { ...defaultTextStyle, content: 'Foo' },
        { ...defaultTextStyle, content: 'bar' },
        { ...defaultTextStyle, weight: 100, content: 'bar' },
        { ...defaultTextStyle, content: 'Foo' },
        { ...defaultTextStyle, content: 'bar' }
      ]
      const expected = [
        { ...defaultTextStyle, content: 'Foobar' },
        { ...defaultTextStyle, weight: 100, content: 'bar' },
        { ...defaultTextStyle, content: 'Foobar' }
      ]
      text.spans.replace(original)
      text.shrink()
      assert.deepEqual(toJS(text.spans), expected)
    })
  })
})
