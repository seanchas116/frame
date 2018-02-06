import { assert } from 'chai'
import { Vec2 } from 'paintvec'
import { Scroll } from './Scroll'

describe('Scroll', () => {
  let scroll: Scroll
  beforeEach(() => {
    scroll = new Scroll()
  })
  describe('viewportToDocument', () => {
    it('returns transform to document', () => {
      scroll.translation = new Vec2(100, 200)
      assert.deepEqual(new Vec2(0, 0).transform(scroll.viewportToDocument), new Vec2(-100, -200))
    })
  })
  describe('documentToViewport', () => {
    it('returns transform to viewport', () => {
      scroll.translation = new Vec2(100, 200)
      assert.deepEqual(new Vec2(0, 0).transform(scroll.documentToViewport), new Vec2(100, 200))
    })
  })
})
