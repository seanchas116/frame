/*
import { assert } from 'chai'
import * as tmp from 'tmp'
import * as fs from 'fs'
import { File } from '../../core/file/File'
import { createDocument } from '../document/DocumentFixture'

describe('File', () => {
  describe('constructor', () => {
    it('creates empty file', () => {
      const file = new File()
      assert.notOk(file.isModified)
    })
  })
  describe('#save', () => {
    it('saves document to file', async () => {
      const file = new File(createDocument())
      file.path = tmp.tmpNameSync()
      file.isModified = true
      await file.save()
      assert(fs.existsSync(file.path))
      assert.notOk(file.isModified)
    })
  })
})
*/
