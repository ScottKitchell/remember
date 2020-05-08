import React, { useState, useRef, useEffect, ComponentProps, ReactNode } from "react"
import { Keyboard, TouchableOpacityProps } from "react-native"
import dayjs from "dayjs"
import RichTextInput from "components/rich-text/text-input"
import styled from "styled-components/native"
import { colors } from "theme"
import { NoteBundle, UnsavedNoteBundle } from "data-store/data-types"
import { NotesStore } from "data-store"
import Icon from "react-native-vector-icons/Feather"
import produce from "immer"

type NoteEditorProps = {
  isOpen: boolean
  onFocus: () => any
  onBlur: () => any
  onSave: () => any
  noteBundle: NoteBundle | null
  noteIndex: number | null | "new"
  toggleNewBundle: () => any
}

export const NoteEditor = ({
  isOpen,
  onFocus,
  onSave,
  onBlur,
  noteBundle,
  noteIndex,
  toggleNewBundle,
}: NoteEditorProps) => {
  const isEditing = !!(noteBundle && typeof noteIndex === "number")
  const isNewBundle = noteBundle === null
  const [noteText, setNoteText] = useState("")

  const noteInputRef = useRef<RichTextInput>(null)

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", onFocus)
    Keyboard.addListener("keyboardDidHide", onBlur)
    return () => {
      Keyboard.removeListener("keyboardDidShow", onFocus)
      Keyboard.removeListener("keyboardDidHide", onBlur)
    }
  }, [onFocus, onBlur])

  useEffect(() => {
    if (!noteInputRef.current) return
    if (isOpen) noteInputRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    if (isOpen && noteBundle && typeof noteIndex === "number")
      setNoteText(noteBundle.notes[noteIndex].text)
  }, [isOpen, noteBundle, noteIndex])

  const updateBundle = (): UnsavedNoteBundle => {
    const now = dayjs().toISOString()

    if (isEditing && noteBundle && typeof noteIndex === "number") {
      // Edit Note
      return produce(noteBundle, draftNoteBundle => {
        draftNoteBundle.notes[noteIndex].text = noteText
        draftNoteBundle.notes[noteIndex].modifiedAt = now
      })
    }

    const newNote = { text: noteText, checkedAt: null, createdAt: now, modifiedAt: now }

    if (noteBundle) {
      // New note appended to bundle
      return produce(noteBundle, draftNoteBundle => {
        draftNoteBundle.notes.push(newNote)
      })
    }

    // New note & bundle
    return { notes: [newNote], createdAt: now, creationType: "user" }
  }

  const save = async () => {
    if (!noteText.trim()) return

    const notesBundle = updateBundle()
    setNoteText("")
    await NotesStore.save(notesBundle)
    onSave()
    if (isEditing) onBlur()
  }

  const insertHashtag = () => noteInputRef.current && noteInputRef.current.insertAtCursor("#")

  const remove = async () => {
    if (!noteBundle) return

    NotesStore.delete(noteBundle.id)
    // if (noteInputRef.current) noteInputRef.current.clear()
    setNoteText("")
    onBlur()
  }

  return (
    <NoteEntryView>
      <NoteEntryContainer>
        <InputCol>
          <NoteInput
            ref={noteInputRef}
            onChangeText={setNoteText}
            value={noteText}
            placeholder="note to self"
            hashtagStyle={{ color: colors.primaryDark }}
            returnKeyType="send"
            onSubmitEditing={save}
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus={true}
            selectionColor={colors.primary}
            enablesReturnKeyAutomatically={true}
          />
        </InputCol>

        <SubmitCol>
          <SaveButton onPress={save} isEditing={isEditing} disabled={!noteText} />
        </SubmitCol>
      </NoteEntryContainer>

      {isOpen && (
        <ControlsContainer>
          <TagButton onPress={insertHashtag} />
          <ReminderButton />
          <RepeatButton />
          <TrashButton onPress={remove} disabled={!isEditing} />
          <ShiftBundleButton shift={isNewBundle ? "up" : "down"} onPress={toggleNewBundle} />
        </ControlsContainer>
      )}
    </NoteEntryView>
  )
}
NoteEditor.defaultProps = {
  noteIndex: 0,
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
  shadow-opacity: 1;
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

const SaveButton = (props: { onPress: () => any; isEditing: boolean; disabled: boolean }) => (
  <SubmitTouchable onPress={props.onPress} isEditing={props.isEditing} disabled={props.disabled}>
    <SubmitIcon name={props.isEditing ? "save" : "send"} />
  </SubmitTouchable>
)

// Because the `send` icon doesn't appear centered correctly,
// we have to modify the padding manually 🙄
const SubmitTouchable = styled.TouchableOpacity<TouchableOpacityProps & { isEditing: boolean }>`
  padding: ${props => (props.isEditing ? "10px" : "11px 11px 9px 9px")};
  background-color: ${props => (props.disabled ? colors.secondary : colors.primary)};
  border-radius: 22px;
  justify-content: center;
  align-items: center;
  color: ${colors.textLight};
`

const SubmitIcon = styled(Icon)`
  font-size: 22px;
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

type ShiftButtonProps = ControlButtonProps & { shift: "up" | "down" }

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
