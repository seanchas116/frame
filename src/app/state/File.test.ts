import { assert } from 'chai'
import * as tmp from 'tmp'
import * as fs from 'fs'
import { File } from './File'
import { createDocument } from '../../core/document/test/Fixture'
import { Document } from '../../core/document/Document'

describe('File', () => {
  describe('constructor', () => {
    it('creates empty file', () => {
      const file = new File(new Document())
      assert.notOk(file.isModified)
    })
  })
  describe('#save', () => {
    it('saves document to file', async () => {
      const file = new File(createDocument())
      file.path = tmp.tmpNameSync()
      file.document.commit('Add Layers')
      await file.save()
      assert(fs.existsSync(file.path))
      assert.notOk(file.isModified)
    })
  })
})
