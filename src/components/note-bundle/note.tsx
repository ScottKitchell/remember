import React from 'react'
import { Text, Vibration } from 'react-native'
import styled from 'styled-components/native'
import { Note } from 'data-store/data-types'
import { colors } from 'theme'

interface NoteProps {
  note: Note
  isFirst: boolean
  isLast: boolean
  onDoneTogglePress: () => any
  onEditPress: () => any
}

export const NoteRow = ({ note, isFirst, isLast, onDoneTogglePress, onEditPress }: NoteProps) => (
  <NoteContainer>
    <DoneIndicatorContainer>
      <DoneIndicator done={note.checked} />
    </DoneIndicatorContainer>

    <NoteBubble
      isFirst={isFirst}
      isLast={isLast}
      done={note.checked}
      onPress={() => {
        onDoneTogglePress()
        Vibration.vibrate(50)
      }}
      onLongPress={() => {
        onEditPress()
        Vibration.vibrate(80)
      }}
    >
      <Text>{note.text}</Text>
    </NoteBubble>
  </NoteContainer>
)

const NoteContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
`

const DoneIndicatorContainer = styled.View`
  flex-grow: 0;
  width: 48px;
  align-items: center;
  align-content: center;
`

interface DoneIndicatorProps {
  done: boolean
}
const DoneIndicator = styled.View<DoneIndicatorProps>`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: ${props => (props.done ? colors.primaryLight : '#f7f7f7')};
`

interface NoteBubbleProps {
  isFirst: boolean
  isLast: boolean
  done: boolean
}

const NoteBubble = styled.TouchableHighlight.attrs({ underlayColor: '#cccccc' })<NoteBubbleProps>`
  flex: 1;
  background-color: ${props => (props.done ? '#f5f5f5' : '#eeeeee')};
  overflow: hidden;
  padding-top: 10px;
  padding-right: 15px;
  padding-bottom: 10px;
  padding-left: 15px;
  border-bottom-color: #e9e9e9;
  border-bottom-width: ${props => (props.isLast ? 0 : 1)}px;
  border-top-left-radius: ${props => (props.isFirst ? 20 : 0)}px;
  border-top-right-radius: ${props => (props.isFirst ? 20 : 0)}px;
  border-bottom-left-radius: ${props => (props.isLast ? 20 : 0)}px;
  border-bottom-right-radius: ${props => (props.isLast ? 20 : 0)}px;
`
