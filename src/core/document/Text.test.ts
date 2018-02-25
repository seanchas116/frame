import { assert } from 'chai'
import { toJS } from 'mobx'
import { Text, TextStyle } from './Text'
import { ValueRange } from '../../lib/ValueRange'

describe('Text', () => {
  let text: Text
  beforeEach(() => {
    text = new Text()
    text.spans.replace([
      { ...TextStyle.default, weight: 300, content: 'Foo' },
      { ...TextStyle.default, weight: 200, size: 14, content: 'Bar' },
      { ...TextStyle.default, weight: 400, size: 8, content: 'Baz' },
      { ...TextStyle.default, weight: 500, size: 20, content: 'Hoge' },
      { ...TextStyle.default, weight: 100, size: 40, content: 'Poyo' }
    ])
  })

  describe('#setStyle', () => {
    it('sets style for span', () => {
      const style = { size: 100 }
      const range = new ValueRange(5, 10)
      text.setStyle(range, style)

      const expected = [
        { ...TextStyle.default, weight: 300, content: 'Foo' },
        { ...TextStyle.default, weight: 200, size: 14, content: 'Ba' },
        { ...TextStyle.default, weight: 200, size: 100, content: 'r' },
        { ...TextStyle.default, weight: 400, size: 100, content: 'Baz' },
        { ...TextStyle.default, weight: 500, size: 100, content: 'H' },
        { ...TextStyle.default, weight: 500, size: 20, content: 'oge' },
        { ...TextStyle.default, weight: 100, size: 40, content: 'Poyo' }
      ]
      assert.deepEqual(toJS(text.spans), expected)
    })
  })

  describe('#shrink', () => {
    it('merges adjacent spans with same style', () => {
      const original = [
        { ...TextStyle.default, content: 'Foo' },
        { ...TextStyle.default, content: 'bar' },
        { ...TextStyle.default, weight: 100, content: 'bar' },
        { ...TextStyle.default, content: 'Foo' },
        { ...TextStyle.default, content: 'bar' }
      ]
      const expected = [
        { ...TextStyle.default, content: 'Foobar' },
        { ...TextStyle.default, weight: 100, content: 'bar' },
        { ...TextStyle.default, content: 'Foobar' }
      ]
      text.spans.replace(original)
      text.shrink()
      assert.deepEqual(toJS(text.spans), expected)
    })
  })
})
