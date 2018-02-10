import * as React from 'react'
import { runInAction } from 'mobx'
import styled, { injectGlobal } from 'styled-components'
import { FormatFileLoader } from '../../core/format/FormatFileLoader'
import { Document } from '../../core/document/Document'
import { EditorView } from '../editor/EditorView'
import { ToolBar } from './ToolBar'
import { LayerList } from './LayerList'
import { Inspector } from './Inspector'

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  :root {
    --background-color: #F0F0F0;
    --front-color: #F8F8F8;
    --primary-color: #47ABFF;
    --text-color: #4A4A4A;
    --default-font-family: BlinkMacSystemFont, "Segoe UI";
  }
  body {
    margin: 0;
    background-color: white;
  }
  * {
    user-select: none;
    font-family: var(--default-font-family);
    color: var(--text-color);
  }
`

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const TitleBar = styled.div`
  height: 22px;
  border-bottom: 2px solid var(--background-color);
  background-color: var(--front-color);
  -webkit-app-region: drag;
`

const EditorViewColumn = styled(EditorView)`
  flex: 1;
`

const Columns = styled.div`
  display: flex;
  flex: 1;
`

export class AppView extends React.Component {
  render () {
    return <Wrap onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
      {process.platform === 'darwin' && <TitleBar />}
      <Columns>
        <ToolBar />
        <LayerList />
        <EditorViewColumn />
        <Inspector />
      </Columns>
    </Wrap>
  }

  private handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  private handleDrop = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    for (let i = 0; i < files.length; ++i) {
      const file = files.item(i)
      const document = await FormatFileLoader.loadFile(file)
      runInAction(() => {
        if (document) {
          const layers = document.rootGroup.children.peek()
          Document.current.insertLayers(layers)
        }
      })
    }
  }
}
