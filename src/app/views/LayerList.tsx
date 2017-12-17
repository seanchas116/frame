import * as React from 'react'
import { observer } from 'mobx-react'
import { TreeView, TreeRowInfo, TreeNode } from 'react-draggable-tree'
import { editor } from '../../editor/state/Editor'
import { Layer } from '../../core/document/Layer'
require('react-draggable-tree/index.css')
const styles = require('./LayerList.css')

const toTreeNode = (layer: Layer): TreeNode => {
  return {
    children: layer.shape.type === 'group' ? layer.children : undefined,
    key: generateKey(layer),
    collapsed: item.collapsed
  }
}

@observer
export class LayerList extends React.Component {
  render () {
    return <TreeView
      className={styles.LayerList}
      rowHeight={40}
      rowContent={this.renderRow}
      root={toTreeNode(editor.document.rootGroup)}
      selectedKeys={selectedKeys}
      onContextMenu={this.handleContextMenu}
      onSelectedKeysChange={this.handleSelectedKeysChange}
      onCollapsedChange={this.handleCollapsedChange}
      onMove={this.handleMove}
      onCopy={this.handleCopy}
    />
  }

  private renderRow = (info: TreeRowInfo) => {
    return <div>row</div>
  }

  private handleContextMenu = (info: TreeRowInfo | undefined, ev: React.MouseEvent<Element>) => {
    if (info) {
      console.log(`Context menu at ${info.path}`)
    } else {
      console.log(`Context menu at blank space`)
    }
  }
  private handleSelectedKeysChange = (selectedKeys: Set<number>) => {
    // TODO
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
