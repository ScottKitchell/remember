import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import { colors } from 'theme'
import { NoteBundleListItem } from 'components/note-bundle'
import { NoteBundle } from 'data-store/data-types'

interface NotesProps {
  noteBundles: NoteBundle[]
  onDoneTogglePress: (noteBundle: NoteBundle, noteIndex: number) => any
  onEditPress: (noteBundleIndex: number, noteIndex: number) => any
  onHashtagPress: (hashtag: string) => void
  editNoteBundleIndex?: number
  editNoteIndex?: number
}

export const NotesFeed = (props: NotesProps) => (
  <NotesKeyboardAvoidingView>
    <NotesFlatList
      data={props.noteBundles}
      extraData={props.noteBundles.length}
      renderItem={({ item, index: noteBundleIndex }) => (
        <NoteBundleListItem
          noteBundle={item}
          onDoneTogglePress={noteIndex => props.onDoneTogglePress(item, noteIndex)}
          onEditPress={noteIndex => props.onEditPress(noteBundleIndex, noteIndex)}
          onHashtagPress={props.onHashtagPress}
        />
      )}
      keyExtractor={noteBundle => noteBundle.id.toString()}
      inverted={true}
    />
  </NotesKeyboardAvoidingView>
)

const NotesKeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${colors.background};
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  z-index: 1;
`

const NotesFlatList = styled(FlatList as new () => FlatList<NoteBundle>)`
  flex: 1;
  padding: 10px;
  overflow: hidden;
`
