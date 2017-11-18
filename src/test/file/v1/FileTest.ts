import { assert } from 'chai'
import { File } from '../../../core/file/v1/File'
import { createDocument } from '../../document/DocumentFixture'

describe('File', () => {
  describe('#toData', () => {
    it('serializes file to data', async () => {
      const document = createDocument()
      const file = new File(document)
      const data = file.toData()
      const file2 = await File.fromData(data)
      assert.deepEqual(document, file2.document)
    })
  })
})
