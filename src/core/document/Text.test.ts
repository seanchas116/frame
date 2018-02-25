import { assert } from 'chai'
import { toJS } from 'mobx'
import { Text, defaultTextSpan } from './Text'
import { ValueRange } from '../../lib/ValueRange'

describe('Text', () => {
  let text: Text
  beforeEach(() => {
    text = new Text()
    text.spans.replace([
      { ...defaultTextSpan, weight: 300, content: 'Foo' },
      { ...defaultTextSpan, weight: 200, size: 14, content: 'Bar' },
      { ...defaultTextSpan, weight: 400, size: 8, content: 'Baz' },
      { ...defaultTextSpan, weight: 500, size: 20, content: 'Hoge' },
      { ...defaultTextSpan, weight: 100, size: 40, content: 'Poyo' }
    ])
  })

  describe('#setStyle', () => {
    it('sets style for span', () => {
      const style = { size: 100 }
      const range = new ValueRange(5, 10)
      text.setStyle(range, style)

      const expected = [
        { ...defaultTextSpan, weight: 300, content: 'Foo' },
        { ...defaultTextSpan, weight: 200, size: 14, content: 'Ba' },
        { ...defaultTextSpan, weight: 200, size: 100, content: 'r' },
        { ...defaultTextSpan, weight: 400, size: 100, content: 'Baz' },
        { ...defaultTextSpan, weight: 500, size: 100, content: 'H' },
        { ...defaultTextSpan, weight: 500, size: 20, content: 'oge' },
        { ...defaultTextSpan, weight: 100, size: 40, content: 'Poyo' }
      ]
      assert.deepEqual(toJS(text.spans), expected)
    })
  })

  describe('#shrink', () => {
    it('merges adjacent spans with same style', () => {
      const original = [
        { ...defaultTextSpan, content: 'Foo' },
        { ...defaultTextSpan, content: 'bar' },
        { ...defaultTextSpan, weight: 100, content: 'bar' },
        { ...defaultTextSpan, content: 'Foo' },
        { ...defaultTextSpan, content: 'bar' }
      ]
      const expected = [
        { ...defaultTextSpan, content: 'Foobar' },
        { ...defaultTextSpan, weight: 100, content: 'bar' },
        { ...defaultTextSpan, content: 'Foobar' }
      ]
      text.spans.replace(original)
      text.shrink()
      assert.deepEqual(toJS(text.spans), expected)
    })
  })
})
