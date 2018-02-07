import * as React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { ShapeType } from '../../core/document/Shape'
import { editor } from '../editor/Editor'

interface IconProps {
  icon: string
  selected: boolean
}

const Icon = styled.div`
  --icon: url(${(props: IconProps) => props.icon});
  width: 32px;
  height: 32px;
  background-color: ${(props: IconProps) => props.selected ? 'var(--primary-color)' : 'var(--text-color)'};
  -webkit-mask: var(--icon) center no-repeat;
  &:hover {
    background-color: ${(props: IconProps) => props.selected ? 'var(--primary-color)' : '#2A2A2A'};
  }
`

const ShapeToolIconButton = observer((props: { type: ShapeType, icon: string }) => {
  const onClick = action(() => {
    editor.insertMode = props.type
  })
  const selected = props.type === editor.insertMode
  return <Icon onClick={onClick} icon={props.icon} selected={selected}></Icon>
})

const Wrap = styled.div`
  width: 40px;
  border-right: 2px solid var(--background-color);
  background-color: var(--front-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
`

export class ToolBar extends React.Component {
  render () {
    return <Wrap>
      <ShapeToolIconButton type='rect' icon={require('./icons/Rectangle20.svg')} />
      <ShapeToolIconButton type='ellipse' icon={require('./icons/Circle20.svg')} />
      <ShapeToolIconButton type='text' icon={require('./icons/Text20.svg')} />
    </Wrap>
  }
}
