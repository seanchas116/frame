import * as React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import * as classNames from 'classnames'
import { ShapeType } from '../../core/document/Shape'
import { editor } from '../editor/Editor'
import * as styles from './ToolBar.scss'

const ShapeToolIcon = observer((props: { type: ShapeType, className: string }) => {
  const onClick = action(() => {
    editor.insertMode = props.type
  })
  const className = classNames(styles.icon, props.className, {
    [styles.icon_selected]: props.type === editor.insertMode
  })
  return <div className={className} onClick={onClick}></div>
})

export class ToolBar extends React.Component {
  render () {
    return <div className={styles.ToolBar}>
      <ShapeToolIcon type='rect' className={styles.icon_rect} />
      <ShapeToolIcon type='ellipse' className={styles.icon_ellipse} />
      <ShapeToolIcon type='text' className={styles.icon_text} />
    </div>
  }
}
