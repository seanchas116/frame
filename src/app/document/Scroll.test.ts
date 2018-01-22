import { assert } from 'chai'
import { Document } from './Document'
import { Vec2 } from 'paintvec'

describe('Scroll', () => {
  let document: Document
  beforeEach(() => {
    document = new Document()
  })
  describe('viewportToDocument', () => {
    it('returns transform to document', () => {
      document.scroll.translation = new Vec2(100, 200)
      assert.deepEqual(new Vec2(0, 0).transform(document.scroll.viewportToDocument), new Vec2(-100, -200))
    })
  })
  describe('documentToViewport', () => {
    it('returns transform to viewport', () => {
      document.scroll.translation = new Vec2(100, 200)
      assert.deepEqual(new Vec2(0, 0).transform(document.scroll.documentToViewport), new Vec2(100, 200))
    })
  })
})
