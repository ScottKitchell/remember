import React, { useState, useRef, useEffect, ComponentProps, ReactNode } from 'react'
import RichTextInput from 'components/rich-text/text-input'
import styled, { css } from 'styled-components/native'
import { colors } from 'theme'
import { NoteBundle, UnsavedNoteBundle } from 'data-store/data-types'
import { NotesStore } from 'data-store'
// import {useSaveNoteBundle} from 'data-store/use-data-store'
import Icon from 'react-native-vector-icons/Feather'

interface NoteEntryProps {
  isOpen: boolean
  onClose: () => any
  onFocus: () => any
  initialNoteBundle?: NoteBundle
  initialNoteIndex: number
  onSaved?: () => any
}

export const NoteEntry = ({
  isOpen,
  onClose,
  initialNoteBundle,
  initialNoteIndex,
  onSaved,
}: NoteEntryProps) => {
  const initialNoteText = initialNoteBundle ? initialNoteBundle.notes[initialNoteIndex].text : ''
  const [noteText, setNoteText] = useState(initialNoteText)
  const [isFocused, setIsFocused] = useState(isOpen)
  const noteInputRef = useRef<RichTextInput>(null)
  // const saveBundle = useSaveNoteBundle()

  useEffect(() => {
    if (isOpen) {
      noteInputRef.current?.focus()
      setIsFocused(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) setNoteText(initialNoteText)
  }, [isOpen, initialNoteText])

  const formBundle = (): UnsavedNoteBundle => {
    if (initialNoteBundle) {
      const updatedNote = { ...initialNoteBundle.notes[initialNoteIndex], text: noteText }
      const updatedNotes = Object.assign([], initialNoteBundle.notes, {
        [initialNoteIndex]: updatedNote,
      })
      return { ...initialNoteBundle, notes: updatedNotes }
    } else {
      return {
        notes: [{ text: noteText, checked: false, createdAt: 'now' }],
        createdAt: 'now',
        creationType: 'user',
      }
    }
  }

  const save = async () => {
    if (noteText.length <= 0) return

    const notesBundle = formBundle()
    setNoteText('')
    // await saveBundle(notesBundle)
    NotesStore.save(notesBundle)
    if (onSaved) onSaved()
  }

  const insertHashtag = () => noteInputRef.current && noteInputRef.current.insertAtCursor('#')

  const remove = async () => {
    if (!initialNoteBundle) return

    NotesStore.delete(initialNoteBundle.id)
    noteInputRef.current?.clear()
    noteInputRef.current?.blur()
  }

  const close = () => {
    setIsFocused(false)
    onClose()
  }

  return (
    <NoteEntryView>
      <NoteEntryContainer>
        <InputCol>
          <NoteInput
            ref={noteInputRef}
            onChangeText={setNoteText}
            value={noteText}
            placeholder="What to remember..."
            hashtagStyle={{ color: colors.primaryDark }}
            returnKeyType="done"
            onFocus={() => setIsFocused(true)}
            onBlur={close}
            autoFocus={true}
            selectionColor={colors.primary}
          />
        </InputCol>
        <SubmitCol>
          <SubmitButton onPress={save}>
            <SubmitIcon name={'arrow-up'} />
          </SubmitButton>
        </SubmitCol>
      </NoteEntryContainer>

      {isFocused && (
        <ControlsContainer>
          <TagButton onPress={insertHashtag} />
          <ReminderButton />
          <RepeatButton />
          <TrashButton onPress={remove} />
          <ShiftBundleButton shift="down" />
        </ControlsContainer>
      )}
    </NoteEntryView>
  )
}
NoteEntry.defaultProps = {
  initialNoteIndex: 0
}

const NoteEntryView = ({ children }: { children: ReactNode }) => (
  <NoteEntryBackground>
    <NoteEntryForeground>{children}</NoteEntryForeground>
  </NoteEntryBackground>
)

const NoteEntryBackground = styled.View`
  background-color: ${colors.background};
  overflow: visible;
  z-index: 2;
`

const NoteEntryForeground = styled.View`
  flex-direction: column;
  background-color: ${colors.background};
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  border-color: transparent;
  shadow-color: #000;
  shadow-offset: 0px 0px;
  shadow-opacity: 1.0;
  shadow-radius: 10px;
  elevation: 15;
`

const NoteEntryContainer = styled.View`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: ${colors.background};
  padding: 10px;
  border-radius: 20px;
`

const InputCol = styled.View`
  flex: 1;
  justify-content: center;
  padding-right: 10px;
`

const SubmitCol = styled.View`
  flex-grow: 0;
  justify-content: flex-end;
`

const NoteInput = styled(RichTextInput).attrs({ multiline: true, selectionColor: colors.primary })`
  background-color: ${colors.bubble};
  border-radius: 22px;
  padding: 10px 15px;
  font-size: 15px;
`

const SubmitButton = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${colors.primary};
  border-radius: 22px;
  justify-content: center;
  align-items: center;
  color: ${colors.textLight};
`

const ControlsContainer = styled.View`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 10px;
`

const TagButton = (props: ControlButtonProps) => (
  <ControlButton {...props}>
    <ControlIcon name="hash" />
  </ControlButton>
)

const ReminderButton = (props: ControlButtonProps) => (
  <ControlButton {...props}>
    <ControlIcon name="bell" />
  </ControlButton>
)

type ShiftButtonProps = ControlButtonProps & { shift: 'up' | 'down' }

const ShiftBundleButton = ({ shift, ...props }: ShiftButtonProps) => (
  <ControlButton {...props}>
    <ControlIcon name={`corner-right-${shift}`} />
  </ControlButton>
)

const RepeatButton = (props: ControlButtonProps) => (
  <ControlButton {...props}>
    <ControlIcon name="repeat" />
  </ControlButton>
)

const TrashButton = (props: ControlButtonProps) => (
  <ControlButton {...props}>
    <ControlIcon name="trash" disabled={props.disabled} />
  </ControlButton>
)

type ControlButtonProps = ComponentProps<typeof ControlButton>

const ControlButton = styled.TouchableOpacity`
  display: flex;
  padding: 8px;
  align-items: center;
  justify-content: center;
`

type ControlIconProps = { disabled?: boolean } & ComponentProps<typeof Icon>
const ControlIcon = styled(Icon)<ControlIconProps>`
  font-size: 22px;
  color: ${props => (!props.disabled ? colors.primaryDark : colors.secondary)};
`

const SubmitIcon = styled(Icon)`
  font-size: 22px;
  color: ${colors.textLight};
`
