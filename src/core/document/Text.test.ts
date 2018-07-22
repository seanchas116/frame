import { assert } from 'chai'
import { toJS } from 'mobx'
import { Text, TextStyle, TextSpan } from './Text'
import { ValueRange } from '../../lib/ValueRange'

describe('Text', () => {
  let text: Text
  beforeEach(() => {
    text = new Text()
    text.spans.replace([
      new TextSpan('Foo', TextStyle.default.assign({ weight: 300 })),
      new TextSpan('Bar', TextStyle.default.assign({ weight: 200, size: 14 })),
      new TextSpan('Baz', TextStyle.default.assign({ weight: 400, size: 8 })),
      new TextSpan('Hoge', TextStyle.default.assign({ weight: 500, size: 20 })),
      new TextSpan('Poyo', TextStyle.default.assign({ weight: 100, size: 40 }))
    ])
  })

  describe('#setStyle', () => {
    it('sets style for span', () => {
      const style = { size: 100 }
      const range = new ValueRange(5, 10)
      text.setStyle(range, style)

      const expected = [
        new TextSpan('Foo', TextStyle.default.assign({ weight: 300 })),
        new TextSpan('Ba', TextStyle.default.assign({ weight: 200, size: 14 })),
        new TextSpan('r', TextStyle.default.assign({ weight: 200, size: 100 })),
        new TextSpan('Baz', TextStyle.default.assign({ weight: 400, size: 100 })),
        new TextSpan('H', TextStyle.default.assign({ weight: 500, size: 100 })),
        new TextSpan('oge', TextStyle.default.assign({ weight: 500, size: 20 })),
        new TextSpan('Poyo', TextStyle.default.assign({ weight: 100, size: 40 }))
      ]
      assert.deepEqual(toJS(text.spans), expected)
    })
  })

  describe('#shrink', () => {
    it('merges adjacent spans with same style', () => {
      const original = [
        new TextSpan('Foo', TextStyle.default),
        new TextSpan('bar', TextStyle.default),
        new TextSpan('bar', TextStyle.default.assign({ weight: 100 })),
        new TextSpan('Foo', TextStyle.default),
        new TextSpan('bar', TextStyle.default)
      ]
      const expected = [
        new TextSpan('Foobar', TextStyle.default),
        new TextSpan('bar', TextStyle.default.assign({ weight: 100 })),
        new TextSpan('Foobar', TextStyle.default)
      ]
      text.spans.replace(original)
      text.shrink()
      assert.deepEqual(toJS(text.spans), expected)
    })
  })
})
