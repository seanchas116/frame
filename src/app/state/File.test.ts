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
  describe('#save', () => {
    describe('in first time', () => {
      it('ask file path and save document to it', async () => {
        const file = new File(createDocument())
        file.document.commit('Add Layers')
        const path = tmp.tmpNameSync()
        assert.equal(file.isModified, true)
        await file.save(() => path)
        assert.equal(file.isModified, false)

        const openedFile = await File.open(file.path!)
        assert.deepEqual(documentToData(openedFile.document), documentToData(file.document))
        assert.equal(openedFile.document.undoStack.commandToUndo, undefined)
        assert.equal(openedFile.isModified, false)
        assert.equal(openedFile.path, file.path)
      })
    })
    describe('once after saved', () => {
      it('save document to same path', async () => {
        const file = new File(createDocument())
        file.document.commit('Add Layers')
        const path = tmp.tmpNameSync()
        assert.equal(file.isModified, true)
        await file.save(() => path)
        assert.equal(file.isModified, false)

        file.document.rootGroup.children[0].name = 'New Layer Name'
        file.document.commit('Change Layer Name')
        assert.equal(file.isModified, true)
        await file.save(() => path)
        assert.equal(file.isModified, false)

        const openedFile = await File.open(file.path!)
        assert.deepEqual(documentToData(openedFile.document), documentToData(file.document))
        assert.equal(openedFile.document.undoStack.commandToUndo, undefined)
        assert.equal(openedFile.isModified, false)
        assert.equal(openedFile.path, file.path)
      })
    })
  })
})
