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

function filterNoteBundles(noteBundles: NoteBundle[], regex: RegExp) {
  const predicate = (noteBundle: NoteBundle) => {
    noteBundle.matches = noteBundle.notes.reduce((matchCount, note) => {
      return matchCount + (note.text.match(regex) || []).length
    }, 0)

    return noteBundle.matches > 0
  }

  const filteredNoteBundles = noteBundles.filter(predicate)
  return filteredNoteBundles.sort(bundle => -1 * (bundle.matches || 0))
}

function NotesScreen() {
  const [rawNoteBundles, setRawNoteBundles] = useState<NoteBundle[]>([])
  const [noteBundles, setNoteBundles] = useState<NoteBundle[]>([])
  const [loading, setLoading] = useState(true)

  const refreshData = async () => {
    console.log('refreshData')
    const notesData = await NotesStore.all()
    setNoteBundles(notesData.reverse())
    setLoading(false)
  }

  useEffect(() => {
    refreshData()
    console.log('set listener')
    NotesStore.addChangeListener(refreshData)
    return () => NotesStore.removeChangeListener(refreshData)
  }, [])

  const search = useCallback((searchTerm: string) => {
    const matchEachWordPattern = RegExp(searchTerm.split(' ').join('|'), 'gi')

    // setNoteBundles(filterNoteBundles(rawNoteBundles, matchEachWordPattern))
  }, [])

  const [editMode, setEditMode] = useState(false)

  const [editBundle, setEditBundle] = useState<NoteBundle>()
  const [editNoteIndex, setEditNoteIndex] = useState<number>()

  const minimizeSearch = false

  const onDoneTogglePress = async (noteBundle: NoteBundle, noteIndex: number) => {
    noteBundle.notes[noteIndex].checked = !noteBundle.notes[noteIndex].checked
    await NotesStore.save(noteBundle)
    // refreshData()
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

  return (
    <Screen>
      <SearchStateProvider>
        <Controls onSearchChange={search} minimize={minimizeSearch} />
        <NoteBundleList
          noteBundles={noteBundles}
          onDoneTogglePress={onDoneTogglePress}
          onEditPress={onEditPress}
        />
        <NoteEntry
          isOpen={editMode}
          onFocus={() => setEditMode(true)}
          onSaved={refresh}
          initialNoteBundle={editBundle}
          initialNoteIndex={editNoteIndex}
        />
      </SearchStateProvider>
    </Screen>
  )
}

interface NoteBundleListProps {
  noteBundles: NoteBundle[]
  onDoneTogglePress: (noteBundle: NoteBundle, noteIndex: number) => any
  onEditPress: (noteBundle: NoteBundle, noteIndex: number) => any
}

const NoteBundleList = ({ noteBundles, onDoneTogglePress, onEditPress }: NoteBundleListProps) => (
  <NotesScrollView>
    <NotesList
      data={noteBundles}
      extraData={noteBundles.length}
      renderItem={({ item }) => (
        <NoteBundleListItem
          noteBundle={item}
          onDoneTogglePress={i => onDoneTogglePress(item, i)}
          onEditPress={i => onEditPress(item, i)}
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
`

const NotesList = styled(FlatList as new () => FlatList<NoteBundle>)`
  flex: 1;
  padding: 10px;
  overflow: hidden;
`

export default NotesScreen
