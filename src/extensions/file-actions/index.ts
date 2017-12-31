import { Extension } from '../../app/state/Extension'
import { FileNewAction } from './FileNewAction'
import { FileOpenAction } from './FileOpenAction'
import { FileSaveAction } from './FileSaveAction'
import { FileSaveAsAction } from './FileSaveAsAction'

export default class implements Extension {
  actions = [
    new FileNewAction(),
    new FileOpenAction(),
    new FileSaveAction(),
    new FileSaveAsAction()
  ]
}
