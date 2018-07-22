import { assert } from 'chai'
import { toJS } from 'mobx'
import { AttributedText, AttributedTextStyle, AttributedTextSpan, AttributedTextLine } from './AttributedText'
import { ValueRange } from '../../lib/ValueRange'

describe('AttributedText', () => {
  let text: AttributedText
  beforeEach(() => {
    text = new AttributedText([
      new AttributedTextLine([
        new AttributedTextSpan('Foo', AttributedTextStyle.default.assign({ weight: 300 })),
        new AttributedTextSpan('Bar', AttributedTextStyle.default.assign({ weight: 200, size: 14 })),
        new AttributedTextSpan('Baz', AttributedTextStyle.default.assign({ weight: 400, size: 8 })),
        new AttributedTextSpan('Hoge', AttributedTextStyle.default.assign({ weight: 500, size: 20 })),
        new AttributedTextSpan('Poyo', AttributedTextStyle.default.assign({ weight: 100, size: 40 }))
      ])
    ])
  })

  describe('#setStyle', () => {
    it('sets style for span', () => {
      // TODO: test multiple lines
      const style = { size: 100 }
      const range = new ValueRange(5, 10)
      text.setStyle(range, style)

      const expected = [
        new AttributedTextSpan('Foo', AttributedTextStyle.default.assign({ weight: 300 })),
        new AttributedTextSpan('Ba', AttributedTextStyle.default.assign({ weight: 200, size: 14 })),
        new AttributedTextSpan('r', AttributedTextStyle.default.assign({ weight: 200, size: 100 })),
        new AttributedTextSpan('Baz', AttributedTextStyle.default.assign({ weight: 400, size: 100 })),
        new AttributedTextSpan('H', AttributedTextStyle.default.assign({ weight: 500, size: 100 })),
        new AttributedTextSpan('oge', AttributedTextStyle.default.assign({ weight: 500, size: 20 })),
        new AttributedTextSpan('Poyo', AttributedTextStyle.default.assign({ weight: 100, size: 40 }))
      ]
      assert.deepEqual(toJS(text.lines[0].spans), expected)
    })
  })

  describe('#shrink', () => {
    it('merges adjacent spans with same style', () => {
      const original = [
        new AttributedTextSpan('Foo', AttributedTextStyle.default),
        new AttributedTextSpan('bar', AttributedTextStyle.default),
        new AttributedTextSpan('bar', AttributedTextStyle.default.assign({ weight: 100 })),
        new AttributedTextSpan('Foo', AttributedTextStyle.default),
        new AttributedTextSpan('bar', AttributedTextStyle.default)
      ]
      const expected = [
        new AttributedTextSpan('Foobar', AttributedTextStyle.default),
        new AttributedTextSpan('bar', AttributedTextStyle.default.assign({ weight: 100 })),
        new AttributedTextSpan('Foobar', AttributedTextStyle.default)
      ]
      text.lines[0].spans.replace(original)
      text.shrink()
      assert.deepEqual(toJS(text.lines[0].spans), expected)
    })
  })
})
