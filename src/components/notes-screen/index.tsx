import React, { ReactNode, useState, useEffect } from 'react'
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
  StyleSheet,
} from 'react-native'
import { colors } from 'theme'
import { Search } from 'components/search'
import { NoteEntry } from 'components/note-entry'
import { NoteBundleListItem } from 'components/note-bundle'
import { NotesStore } from 'data-store'
// import {useNoteBundles, useSaveNoteBundle} from 'data-store/use-data-store'

import { NoteBundle } from 'data-store/data-types'

interface ScreenProps {
  children?: ReactNode
}

const Screen = ({ children }: ScreenProps) => {
  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>{children}</SafeAreaView>
    </>
  )
}

const NotesScreen = ({ children }: ScreenProps) => {
  // const [noteBundles, refreshData] = useNoteBundles()
  // const saveBundle = useSaveNoteBundle()

  const [noteBundles, setNoteBundles] = useState<NoteBundle[]>([])
  const [loading, setLoading] = useState(true)

  // const refreshData = () => NotesStore.all().then(setNoteBundles)

  useEffect(() => {
    NotesStore.all().then(setNoteBundles)
    setLoading(false)
  }, [])

  const [editMode, setEditMode] = useState(false)

  const [editBundle, setEditBundle] = useState<NoteBundle>()
  const [editNoteIndex, setEditNoteIndex] = useState<number>()

  const minimizeSearch = false

  const search = (value: string) => {
    console.log('search for:', value)
  }

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
      <Search onSearchChange={search} minimize={minimizeSearch} />
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
    </Screen>
  )
}

interface NoteBundleListProps {
  noteBundles: NoteBundle[]
  onDoneTogglePress: (noteBundle: NoteBundle, noteIndex: number) => any
  onEditPress: (noteBundle: NoteBundle, noteIndex: number) => any
}

const NoteBundleList = ({ noteBundles, onDoneTogglePress, onEditPress }: NoteBundleListProps) => {
  return (
    <KeyboardAvoidingView style={styles.notesView}>
      <FlatList
        style={styles.notesList}
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  notesView: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  notesList: {
    flex: 1,
    padding: 10,
  },
})

export default NotesScreen
