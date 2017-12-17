import { assert } from 'chai'
import { Editor } from './Editor'
import { Vec2 } from 'paintvec'

describe('Scroll', () => {
  let editor: Editor
  beforeEach(() => {
    editor = new Editor()
  })
  describe('viewportToDocument', () => {
    it('returns transform to document', () => {
      editor.scroll.translation = new Vec2(100, 200)
      assert.deepEqual(new Vec2(0, 0).transform(editor.scroll.viewportToDocument), new Vec2(-100, -200))
    })
  })
  describe('documentToViewport', () => {
    it('returns transform to viewport', () => {
      editor.scroll.translation = new Vec2(100, 200)
      assert.deepEqual(new Vec2(0, 0).transform(editor.scroll.documentToViewport), new Vec2(100, 200))
    })
  })
})
