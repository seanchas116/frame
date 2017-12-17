import * as React from 'react'
import { observer } from 'mobx-react'
import { TreeView, TreeRowInfo, TreeNode } from 'react-draggable-tree'
import { editor } from '../../editor/state/Editor'
import { Layer } from '../../core/document/Layer'
require('react-draggable-tree/lib/index.css')
const styles = require('./LayerList.css')

const toTreeNode = (layer: Layer): TreeNode => {
  return {
    children: layer.shape.type === 'group' ? layer.children.map(toTreeNode) : undefined,
    key: layer.key,
    collapsed: layer.collapsed
  }
}

const layerFromInfo = (info: TreeRowInfo) => {
  return editor.document.rootGroup.ancestor(info.path)
}

@observer
export class LayerList extends React.Component {
  render () {
    const selectedKeys = editor.selection.layers.map(l => l.key)
    const root = toTreeNode(editor.document.rootGroup)

    return <TreeView
      className={styles.LayerList}
      rowHeight={24}
      rowContent={this.renderRow}
      root={root}
      selectedKeys={new Set(selectedKeys)}
      onContextMenu={this.handleContextMenu}
      onSelectedKeysChange={this.handleSelectedKeysChange}
      onCollapsedChange={this.handleCollapsedChange}
      onMove={this.handleMove}
      onCopy={this.handleCopy}
    />
  }

  private renderRow = (info: TreeRowInfo) => {
    const layer = layerFromInfo(info)
    return <div>{layer.name}</div>
  }

  private handleContextMenu = (info: TreeRowInfo | undefined, ev: React.MouseEvent<Element>) => {
    if (info) {
      console.log(`Context menu at ${info.path}`)
    } else {
      console.log(`Context menu at blank space`)
    }
  }
  private handleSelectedKeysChange = (selectedKeys: Set<number>, selectedInfos: TreeRowInfo[]) => {
    editor.selection.replace(selectedInfos.map(layerFromInfo))
  }
  private handleCollapsedChange = (info: TreeRowInfo, collapsed: boolean) => {
    // TODO
  }
  private handleMove = (src: TreeRowInfo[], dest: TreeRowInfo, destIndex: number, destPathAfterMove: number[]) => {
    // TODO
  }
  private handleCopy = (src: TreeRowInfo[], dest: TreeRowInfo, destIndex: number) => {
    // TODO
  }
}
