import React, {useState, useRef, useEffect} from 'react'
import {
  TextInput,
  TextInputProperties,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  StyleSheet,
} from 'react-native'
import styled from 'styled-components/native'
import {colors} from 'theme'
import {NoteBundle, UnsavedNoteBundle} from 'data-store/data-types'
import {NotesStore} from 'data-store'
// import {useSaveNoteBundle} from 'data-store/use-data-store'

interface NoteEntryProps {
  isOpen: boolean
  onFocus: () => any
  initialNoteBundle?: NoteBundle
  initialNoteIndex: number
  onSaved?: () => any
}

export const NoteEntry = ({
  isOpen,
  initialNoteBundle,
  initialNoteIndex,
  onSaved,
}: NoteEntryProps) => {
  const initialNoteText = initialNoteBundle ? initialNoteBundle.notes[initialNoteIndex].text : ''
  const [noteText, setNoteText] = useState(initialNoteText)
  const noteInputRef = useRef<TextInput>(null)
  // const saveBundle = useSaveNoteBundle()

  useEffect(() => {
    if (isOpen && noteInputRef.current) {
      noteInputRef.current.focus()
    }
  }, [isOpen, noteInputRef.current])

  useEffect(() => {
    if (isOpen) setNoteText(initialNoteText)
  }, [isOpen, initialNoteText])

  const formBundle = (): UnsavedNoteBundle => {
    if (initialNoteBundle) {
      const updatedNote = {...initialNoteBundle.notes[initialNoteIndex], text: noteText}
      const updatedNotes = Object.assign([], initialNoteBundle.notes, {
        [initialNoteIndex]: updatedNote,
      })
      return {...initialNoteBundle, notes: updatedNotes}
    } else {
      return {
        notes: [{text: noteText, checked: false, createdAt: 'now'}],
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

  return (
    <NoteEntryContainer>
      <InputCol>
        <NoteInput ref={noteInputRef} onChangeText={setNoteText} value={noteText} />
      </InputCol>
      <SubmitCol>
        <SubmitButton>
          <SubmitButtonText onPress={save}>Next</SubmitButtonText>
        </SubmitButton>
      </SubmitCol>
    </NoteEntryContainer>
  )
}
NoteEntry.defaultProps = {
  initialNoteIndex: 0,
}

const NoteEntryContainer = styled.View`
  flex-direction: row;
  align-items: stretch;
  background-color: ${colors.background};
  border-top-width: 1px;
  border-top-color: #eee;
  padding: 10px;
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

const NoteInput = styled.TextInput.attrs({placeholder: 'Aa', multiline: true})`
  background-color: ${colors.bubble};
  border-radius: 22px;
  padding-top: 6px;
  padding-right: 15px;
  padding-bottom: 6px;
  padding-left: 15px;
`

const SubmitButton = styled.TouchableOpacity`
  padding-top: 10px;
  padding-bottom: 10px;
  width: 60px;
  background-color: ${colors.primary};
  border-radius: 22px;
  justify-content: center;
  align-items: center;
`

const SubmitButtonText = styled.Text`
  color: ${colors.textLight};
`
