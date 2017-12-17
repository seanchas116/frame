import { assert } from 'chai'
import { App } from './App'
import { Vec2 } from 'paintvec'

describe('Scroll', () => {
  let app: App
  beforeEach(() => {
    app = new App()
  })
  describe('viewportToDocument', () => {
    it('returns transform to document', () => {
      app.scroll.translation = new Vec2(100, 200)
      assert.deepEqual(new Vec2(0, 0).transform(app.scroll.viewportToDocument), new Vec2(-100, -200))
    })
  })
  describe('documentToViewport', () => {
    it('returns transform to viewport', () => {
      app.scroll.translation = new Vec2(100, 200)
      assert.deepEqual(new Vec2(0, 0).transform(app.scroll.documentToViewport), new Vec2(100, 200))
    })
  })
})
