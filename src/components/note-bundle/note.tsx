import React, { useCallback } from 'react'
import { Vibration, Linking, ToastAndroid } from 'react-native'
import styled from 'styled-components/native'
import { Note } from 'data-store/data-types'
import { colors, text } from 'theme'
import RichText from 'components/rich-text/text'
import Icon from 'react-native-vector-icons/Feather'

interface NoteProps {
  note: Note
  isFirst: boolean
  isLast: boolean
  onDoneTogglePress: () => any
  onEditPress: () => any
  onHashtagPress: (hashtag: string) => any
}
export const NoteRow = ({
  note,
  isFirst,
  isLast,
  onDoneTogglePress,
  onEditPress,
  onHashtagPress,
}: NoteProps) => {
  const toggleChecked = () => {
    onDoneTogglePress()
    Vibration.vibrate(30)
  }

  const edit = () => {
    onEditPress()
    Vibration.vibrate(60)
  }

  const openUrl = async (url: string) =>
    Linking.openURL(url).catch(() =>
      ToastAndroid.showWithGravity('Could not open URL', ToastAndroid.SHORT, ToastAndroid.BOTTOM),
    )

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
        <FormattedText onUrlPress={openUrl} onHashtagPress={onHashtagPress}>
          {note.text}
        </FormattedText>
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

const NoteBubble = styled.TouchableHighlight.attrs({ underlayColor: colors.bubbleLight })<
  NoteBubbleProps
>`
  flex: 0 1 auto;
  background-color: ${props => (props.done ? colors.bubbleLight : colors.bubble)};
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

const FormattedText = styled(RichText).attrs({
  hashtagStyle: { color: colors.primaryDark },
  urlStyle: { color: colors.primaryDark, textDecorationLine: 'underline' },
})`
  font-size: 15px;
`
