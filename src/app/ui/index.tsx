import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppView } from './AppView'

window.addEventListener('load', () => {
  ReactDOM.render(<AppView />, document.getElementById('root'))
})

if (module.hot) {
  module.hot.accept()
}
