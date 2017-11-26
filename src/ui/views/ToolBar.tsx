import * as React from 'react'
import { observer } from 'mobx-react'
import * as classNames from 'classnames'
import { ShapeType } from '../../core/document/Shape'
import { app } from '../../core/app/App'
const styles = require('./ToolBar.css')

const ShapeToolIcon = observer((props: { type: ShapeType, className: string }) => {
  const onClick = () => {
    app.insertMode = props.type
  }
  const className = classNames(styles.ShapeToolIcon, props.className, {
    [styles.ShapeToolIconSelected]: props.type === app.insertMode
  })
  return <div className={className} onClick={onClick}></div>
})

export class ToolBar extends React.Component {
  render () {
    return <div className={styles.ToolBar}>
      <ShapeToolIcon type='rect' className={styles.ShapeToolIconRect} />
      <ShapeToolIcon type='ellipse' className={styles.ShapeToolIconEllipse} />
      <ShapeToolIcon type='text' className={styles.ShapeToolIconText} />
    </div>
  }
}
