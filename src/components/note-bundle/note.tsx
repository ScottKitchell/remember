import React from 'react'
import { Vibration } from 'react-native'
import styled from 'styled-components/native'
import { Note } from 'data-store/data-types'
import { colors } from 'theme'
import RichText from 'components/rich-text/text'
import Icon from 'react-native-vector-icons/Feather'

interface NoteProps {
  note: Note
  isFirst: boolean
  isLast: boolean
  onDoneTogglePress: () => any
  onEditPress: () => any
}

export const NoteRow = ({ note, isFirst, isLast, onDoneTogglePress, onEditPress }: NoteProps) => {
  const toggleChecked = () => {
    onDoneTogglePress()
    Vibration.vibrate(50)
  }

  const edit = () => {
    onEditPress()
    Vibration.vibrate(80)
  }

  return (
    <NoteContainer>
      <DoneIndicatorContainer onPress={toggleChecked}>
        <DoneIndicator done={note.checked} />
      </DoneIndicatorContainer>

      <NoteBubble
        isFirst={isFirst}
        isLast={isLast}
        done={note.checked}
        onPress={toggleChecked}
        onLongPress={edit}
      >
        <RichText hashtagStyle={{ color: colors.primary }}>{note.text}</RichText>
      </NoteBubble>
    </NoteContainer>
  )
}

const NoteContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

const DoneIndicatorContainer = styled.TouchableOpacity`
  flex: 48px 0 0;
  align-items: center;
  align-content: center;
`

interface DoneIndicatorProps {
  done: boolean
}
const DoneIndicator = styled(Icon).attrs({ name: 'check' })<DoneIndicatorProps>`
  height: 20px;
  width: 20px;
  font-size: 20px;
  color: ${props => (props.done ? colors.primary : '#f7f7f7')};
`

interface NoteBubbleProps {
  isFirst: boolean
  isLast: boolean
  done: boolean
}

const NoteBubble = styled.TouchableOpacity<NoteBubbleProps>`
  flex: 0 1 auto;
  background-color: ${props => (props.done ? '#f5f5f5' : '#eeeeee')};
  overflow: hidden;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  border-bottom-color: #e9e9e9;
  border-bottom-width: ${props => (props.isLast ? 0 : 1)}px;
  border-top-left-radius: ${props => (props.isFirst ? 20 : 0)}px;
  border-top-right-radius: ${props => (props.isFirst ? 20 : 0)}px;
  border-bottom-left-radius: ${props => (props.isLast ? 20 : 0)}px;
  border-bottom-right-radius: ${props => (props.isLast ? 20 : 0)}px;
`
