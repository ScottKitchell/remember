import React, {ReactNode, useState} from 'react'
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
  StyleSheet,
} from 'react-native'
import {colors} from 'theme'
import {Search} from 'components/search'
import {NoteEntry} from 'components/note-entry'
import {NoteBundle} from 'components/note-bundle'
import {useNoteBundles, useSaveNoteBundle} from 'data-store/use-data'
import {note, noteBundle} from 'data-store/data-types'

interface ScreenProps {
  children?: ReactNode
}

const Screen = ({children}: ScreenProps) => {
  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{backgroundColor: colors.primary, flex: 1}}>{children}</SafeAreaView>
    </>
  )
}

const NotesScreen = ({children}: ScreenProps) => {
  const [noteBundles, refreshData] = useNoteBundles()
  const saveBundle = useSaveNoteBundle()

  const [editMode, setEditMode] = useState(false)

  const [editBundle, setEditBundle] = useState<noteBundle>()
  const [editNoteIndex, setEditNoteIndex] = useState<number>()

  const minimizeSearch = false

  const search = (value: string) => {
    console.log('search for:', value)
  }

  const onDoneTogglePress = async (noteBundle: noteBundle, noteIndex: number) => {
    noteBundle.notes[noteIndex].checked = !noteBundle.notes[noteIndex].checked
    await saveBundle(noteBundle)
    refreshData()
  }

  const onEditPress = (noteBundle: noteBundle, noteIndex: number) => {
    setEditBundle(noteBundle)
    setEditNoteIndex(noteIndex)
    setEditMode(true)
  }

  const refresh = () => {
    setEditBundle(undefined)
    setEditNoteIndex(undefined)
    setEditMode(false)
    refreshData()
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
  noteBundles: noteBundle[]
  onDoneTogglePress: (noteBundle: noteBundle, noteIndex: number) => any
  onEditPress: (noteBundle: noteBundle, noteIndex: number) => any
}

const NoteBundleList = ({noteBundles, onDoneTogglePress, onEditPress}: NoteBundleListProps) => {
  return (
    <KeyboardAvoidingView style={styles.notesView}>
      <FlatList
        style={styles.notesList}
        data={noteBundles}
        extraData={noteBundles.length}
        renderItem={({item}) => (
          <NoteBundle
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
