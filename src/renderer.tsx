import * as React from 'react'
import * as ReactDOM from 'react-dom'
import BasicActionsPlugin from './plugins/basic-actions'
import './config'
import { AppView } from './app/views/AppView'
import { pluginRegistry } from './app/state/Plugin'

pluginRegistry.load(new BasicActionsPlugin())

ReactDOM.render(<AppView />, document.getElementById('root'))
