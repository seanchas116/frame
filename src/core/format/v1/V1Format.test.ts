import { assert } from 'chai'
import { V1Format } from './V1Format'
import { createDocument } from '../../document/test/Fixture'

describe('V1Format', () => {
  describe('#serialize/deserialize', () => {
    it('serializes file to data', async () => {
      const v1Format = new V1Format()
      const document = createDocument()
      const data = await v1Format.serialize(document)
      const document2 = await v1Format.deserialize(data)
      const data2 = await v1Format.serialize(document2)
      assert.deepEqual(data2, data)
    })
  })
})
