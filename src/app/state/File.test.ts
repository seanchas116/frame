import { assert } from 'chai'
import * as tmp from 'tmp'
import { File } from './File'
import { createDocument } from '../../core/document/test/Fixture'
import { Document } from '../../core/document/Document'
import { documentToData } from '../../core/format/v1/Serialize';

describe('File', () => {
  describe('constructor', () => {
    it('creates empty file', () => {
      const file = new File(new Document())
      assert.equal(file.isModified, false)
    })
  })
  describe('#save/.open', () => {
    it('saves document to file', async () => {
      const file = new File(createDocument())
      file.path = tmp.tmpNameSync()
      file.document.commit('Add Layers')
      await file.save()
      assert.equal(file.isModified, false)

      const openedFile = await File.open(file.path)
      assert.deepEqual(documentToData(openedFile.document), documentToData(file.document))
      assert.equal(openedFile.document.undoStack.commandToUndo, undefined)
      assert.equal(openedFile.isModified, false)
      assert.equal(openedFile.path, file.path)
    })
  })
})
