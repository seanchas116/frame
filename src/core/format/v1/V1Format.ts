import { runInAction } from 'mobx'
import * as msgpack from 'msgpack-lite'
import { Format } from '../Format'
import { Document } from '../../document/Document'
import { FileV1Format } from './Schema'
import { documentToData } from './Serialize'
import { dataToDocument } from './Deserialize'

export class V1Format implements Format {
  readonly extensions = Object.freeze(['frame'])
  readonly mime = 'application/x-frame-document'
  readonly uti = 'com.seanchas116.frame.document'
  readonly isLayered = true

  async serialize (document: Document) {
    const data: FileV1Format = {
      version: 1,
      ...documentToData(document)
    }
    return msgpack.encode(data)
  }

  async deserialize (buffer: Buffer) {
    const data: FileV1Format = msgpack.decode(buffer)
    // TODO: validate data format
    return runInAction(() => dataToDocument(data))
  }
}
