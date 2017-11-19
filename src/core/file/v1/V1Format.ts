import { Format } from '../Format'
import { Document } from '../../document/Document'
import { FileV1Format } from './Schema'
import { documentToData } from './Serialize'
import * as msgpack from 'msgpack-lite'
import { dataToDocument } from './Deserialize'

export class V1Format implements Format {
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
    return dataToDocument(data)
  }
}
