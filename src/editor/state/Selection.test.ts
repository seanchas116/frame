import { assert } from 'chai'
import { App } from './App'
import { Layer } from '../../core/document/Layer'

describe('Selection', () => {
  let app: App
  beforeEach(() => {
    app = new App()
  })
  describe('layers', () => {
    it('returns selected layers sorted', () => {
      const layer1 = new Layer()
      const layer2 = new Layer()
      const layer3 = new Layer()
      const leakedLayer = new Layer()
      layer2.children.push(layer3)
      app.layers.push(layer1, layer2)

      app.selection.add(layer3)
      app.selection.add(layer1)
      app.selection.add(leakedLayer)

      assert.deepEqual(app.selection.layers, [layer1, layer3])
    })
  })
})
