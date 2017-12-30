import { extensionRegistry } from '../app/state/Extension'
import BasicActionsExtension from '../extensions/basic-actions'

extensionRegistry.add(new BasicActionsExtension())
