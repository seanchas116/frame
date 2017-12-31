import { extensionRegistry } from '../app/state/Extension'
import EditActionsExtension from '../extensions/edit-actions'
import FileActionsExtension from '../extensions/file-actions'

extensionRegistry.add(new EditActionsExtension())
extensionRegistry.add(new FileActionsExtension())
