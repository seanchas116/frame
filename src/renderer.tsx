import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BasicActionsExtension from './extensions/basic-actions'
import './config'
import { AppView } from './app/views/AppView'
import { extensionRegistry } from './app/state/Extension'

extensionRegistry.add(new BasicActionsExtension())

ReactDOM.render(<AppView />, document.getElementById('root'))
