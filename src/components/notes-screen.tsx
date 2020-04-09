import React, { useState, useEffect, useCallback } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import { colors } from 'theme'
import { Controls } from 'components/controls'
import { NoteEntry } from 'components/note-entry'
import { NoteBundleListItem } from 'components/note-bundle'
import Screen from 'components/screen'
import { NotesStore } from 'data-store'
import { NoteBundle } from 'data-store/data-types'
import { SearchStateProvider } from 'components/search'
import dayjs from 'dayjs'

function NotesScreen() {
  const [noteBundles, setNoteBundles] = useState<NoteBundle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const refreshData = useCallback(async () => {
    // console.log(`refreshData - search: "${searchTerm}"`)
    let notesData: NoteBundle[]
    if (searchTerm) {
      const regex = RegExp(searchTerm.split(' ').join('|'), 'gi')
      notesData = await NotesStore.filter((noteBundle: NoteBundle) => {
        // memory.matches is the negative of how many times the substring is found
        // which is used for the sortBy below. Negative is used to sort desc.
        noteBundle.matches = (noteBundle.notes[0].text.match(regex) || []).length
        return noteBundle.matches > 0
      })
      //  _.sortBy(memories, (memory) => (-1 * memory.matches))
    } else notesData = await NotesStore.all()

    setNoteBundles(notesData.reverse())
    setLoading(false)
  }, [searchTerm])

  useEffect(() => {
    refreshData()
    NotesStore.addChangeListener(refreshData)
    return () => NotesStore.removeChangeListener(refreshData)
  }, [refreshData, searchTerm])

  const [editMode, setEditMode] = useState(false)

  const [editBundle, setEditBundle] = useState<NoteBundle>()
  const [editNoteIndex, setEditNoteIndex] = useState<number>()

  const minimizeSearch = false

  const onDoneTogglePress = async (noteBundle: NoteBundle, noteIndex: number) => {
    noteBundle.notes[noteIndex].checkedAt = !noteBundle.notes[noteIndex].checkedAt
      ? dayjs().toISOString()
      : null
    await NotesStore.save(noteBundle)
  }

  const onEditPress = (noteBundle: NoteBundle, noteIndex: number) => {
    setEditBundle(noteBundle)
    setEditNoteIndex(noteIndex)
    setEditMode(true)
  }

  const refresh = () => {
    setEditBundle(undefined)
    setEditNoteIndex(undefined)
    setEditMode(false)
    // refreshData()
  }

  const onEditClose = () => {
    setEditMode(false)
    setEditBundle(undefined)
    setEditNoteIndex(undefined)
  }

  return (
    <Screen>
      <SearchStateProvider>
        <Controls
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          minimize={minimizeSearch}
        />
        <NoteBundleList
          noteBundles={noteBundles}
          onDoneTogglePress={onDoneTogglePress}
          onEditPress={onEditPress}
          onHashtagPress={setSearchTerm}
        />
        <NoteEntry
          isOpen={editMode}
          onFocus={() => setEditMode(true)}
          onSaved={refresh}
          initialNoteBundle={editBundle}
          initialNoteIndex={editNoteIndex}
          onClose={onEditClose}
        />
      </SearchStateProvider>
    </Screen>
  )
}

interface NoteBundleListProps {
  noteBundles: NoteBundle[]
  onDoneTogglePress: (noteBundle: NoteBundle, noteIndex: number) => any
  onEditPress: (noteBundle: NoteBundle, noteIndex: number) => any
  onHashtagPress: (hashtag: string) => void
}

const NoteBundleList = (props: NoteBundleListProps) => (
  <NotesScrollView>
    <NotesList
      data={props.noteBundles}
      extraData={props.noteBundles.length}
      renderItem={({ item }) => (
        <NoteBundleListItem
          noteBundle={item}
          onDoneTogglePress={i => props.onDoneTogglePress(item, i)}
          onEditPress={i => props.onEditPress(item, i)}
          onHashtagPress={props.onHashtagPress}
        />
      )}
      keyExtractor={noteBundle => noteBundle.id.toString()}
      inverted={true}
    />
  </NotesScrollView>
)

const NotesScrollView = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${colors.background};
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  z-index: 1;
`

const NotesList = styled(FlatList as new () => FlatList<NoteBundle>)`
  flex: 1;
  padding: 10px;
  overflow: hidden;
`

export default NotesScreen
