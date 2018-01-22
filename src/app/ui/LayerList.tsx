import * as React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { TreeView, TreeRowInfo, TreeNode } from 'react-draggable-tree'
import { editor } from '../editor/Editor'
import { Layer } from '../document/Layer'
import { ClickToEdit } from './components/ClickToEdit'
import 'react-draggable-tree/lib/index.css'
import * as styles from './LayerList.scss'

const toTreeNode = (layer: Layer): TreeNode => {
  return {
    children: layer.shape.type === 'group' ? layer.children.map(toTreeNode) : undefined,
    key: layer.key,
    collapsed: layer.collapsed
  }
}

const layerForPath = (path: number[]) => {
  return editor.document.rootGroup.descendant(path)
}

@observer
class LayerRowContent extends React.Component<TreeRowInfo> {
  render () {
    const layer = layerForPath(this.props.path)
    const onChange = action((text: string) => {
      layer.name = text
    })
    const editable = editor.document.selection.has(layer)
    return <div className={styles.content}>
      <ClickToEdit text={layer.name} onChange={onChange} editable={editable} />
    </div>
  }
}

@observer
export class LayerList extends React.Component {
  render () {
    const selectedKeys = editor.document.selection.layers.map(l => l.key)
    const root = toTreeNode(editor.document.rootGroup)

    return <TreeView
      className={styles.LayerList}
      rowClassName={styles.row}
      rowSelectedClassName={styles.row_selected}
      rowHeight={24}
      rowContent={LayerRowContent}
      root={root}
      selectedKeys={new Set(selectedKeys)}
      onContextMenu={this.handleContextMenu}
      onSelectedKeysChange={this.handleSelectedKeysChange}
      onCollapsedChange={this.handleCollapsedChange}
      onMove={this.handleMove}
      onCopy={this.handleCopy}
    />
  }

  @action private handleContextMenu = (info: TreeRowInfo | undefined, ev: React.MouseEvent<Element>) => {
    if (info) {
      console.log(`Context menu at ${info.path}`)
    } else {
      console.log(`Context menu at blank space`)
    }
  }
  @action private handleSelectedKeysChange = (selectedKeys: Set<number>, selectedInfos: TreeRowInfo[]) => {
    editor.document.selection.replace(selectedInfos.map(info => layerForPath(info.path)))
  }
  @action private handleCollapsedChange = (info: TreeRowInfo, collapsed: boolean) => {
    layerForPath(info.path).collapsed = collapsed
  }
  @action private handleMove = (src: TreeRowInfo[], dest: TreeRowInfo, destIndex: number, destPathAfterMove: number[]) => {
    const items: Layer[] = []
    for (let i = src.length - 1; i >= 0; --i) {
      const { path } = src[i]
      const index = path[path.length - 1]
      const parent = layerForPath(path.slice(0, -1))
      const [item] = parent.children.splice(index, 1)
      items.unshift(item)
    }
    const destItem = layerForPath(destPathAfterMove.slice(0, -1))
    destItem.children.splice(destPathAfterMove[destPathAfterMove.length - 1], 0, ...items)
    destItem.collapsed = false
    editor.document.commit('Move Layers')
  }
  @action private handleCopy = (src: TreeRowInfo[], dest: TreeRowInfo, destIndex: number) => {
    const items: Layer[] = []
    for (let i = src.length - 1; i >= 0; --i) {
      const { path } = src[i]
      const index = path[path.length - 1]
      const parent = layerForPath(path.slice(0, -1))
      const item = parent.children[index].clone()
      items.unshift(item)
    }
    const destItem = layerForPath(dest.path)
    destItem.children.splice(destIndex, 0, ...items)
    destItem.collapsed = false
    editor.document.commit('Copy Layers')
  }
}