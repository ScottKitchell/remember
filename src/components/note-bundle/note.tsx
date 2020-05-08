import React, { useCallback, ComponentProps } from "react"
import { Vibration, Linking, ToastAndroid, View } from "react-native"
import styled from "styled-components/native"
import { Note } from "data-store/data-types"
import { colors, text } from "theme"
import RichText from "components/rich-text/text"
import Icon from "react-native-vector-icons/Feather"

interface NoteProps {
  note: Note
  isFirst: boolean
  isLast: boolean
  onDoneTogglePress: () => any
  onEditPress: () => any
  onHashtagPress: (hashtag: string) => any
  isDraft: boolean
}
export const NoteRow = ({
  note,
  isFirst,
  isLast,
  onDoneTogglePress,
  onEditPress,
  onHashtagPress,
  isDraft,
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
      ToastAndroid.showWithGravity("Could not open URL", ToastAndroid.SHORT, ToastAndroid.BOTTOM),
    )

  return (
    <NoteContainer>
      <DoneIndicatorContainer onPress={toggleChecked}>
        {!isDraft && <DoneIndicator done={!!note.checkedAt} />}
      </DoneIndicatorContainer>

      <NoteBubble
        isFirst={isFirst}
        isLast={isLast}
        done={!!note.checkedAt}
        // onPress={toggleChecked}
        onLongPress={edit}
        disabled={isDraft}
        draft={isDraft}
      >
        <FormattedText onUrlPress={openUrl} onHashtagPress={onHashtagPress} draft={isDraft}>
          {note.text}
        </FormattedText>
      </NoteBubble>
    </NoteContainer>
  )
}

export const NewDraftNoteRow = () => {
  const draftNote: Note = {
    text: "",
    createdAt: "now",
    modifiedAt: "now",
    checkedAt: null,
  }

  return (
    <NoteRow
      note={draftNote}
      isFirst={false}
      isLast={true}
      onDoneTogglePress={() => {}}
      onEditPress={() => {}}
      onHashtagPress={() => {}}
      isDraft={true}
    />
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
const DoneIndicator = styled(Icon).attrs({ name: "check" })<DoneIndicatorProps>`
  height: 20px;
  width: 20px;
  font-size: 20px;
  color: ${props => (props.done ? colors.primary : "#f2f2f2")};
`

interface NoteBubbleProps {
  isFirst: boolean
  isLast: boolean
  done: boolean
  draft: boolean
}

const NoteBubble = styled.TouchableHighlight.attrs({ underlayColor: colors.bubbleLight })<
  NoteBubbleProps
>`
  flex: 0 1 auto;
  opacity: ${props => (props.done ? 0.4 : 1)};
  background-color: ${props => (props.draft ? colors.bubbleDraft : colors.bubble)};
  overflow: hidden;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  margin-bottom: ${props => (props.isLast ? 0 : 2)}px;
  border-bottom-width: 0px;
  border-top-left-radius: 18px;
  border-top-right-radius: ${props => (props.isFirst ? 18 : 3)}px;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: ${props => (props.isLast ? 18 : 3)}px;
`

type FormattedTextProps = { draft: boolean } & ComponentProps<typeof RichText>
const FormattedText = styled(RichText).attrs({
  hashtagStyle: { color: colors.primaryDark },
  urlStyle: { color: colors.primaryDark, textDecorationLine: "underline" },
})<FormattedTextProps>`
  font-size: 15px;
  color: ${props => (props.draft ? colors.textDark : colors.textDark)};
`
