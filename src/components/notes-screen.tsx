import React, { useState, useReducer, useEffect, useCallback } from 'react'
import Screen from './screen'
import { Controls } from 'components/controls'
import { NotesFeed } from 'components/notes-feed'
import { NoteEditor } from 'components/note-editor'
import { NotesStore } from 'data-store'
import { NoteBundle } from 'data-store/data-types'
import dayjs from 'dayjs'

function NotesScreen() {
  const [searchTerm, setSearchTerm] = useState('')
  const minimizeSearch = false

  const noteBundles = useNoteBundles(searchTerm)

  const [editorState, dispatchEditorState] = useEditorReducer({
    open: true,
    newBundle: true,
    noteBundleIndex: undefined,
    noteIndex: undefined,
  })

  const onDoneTogglePress = useCallback((noteBundle: NoteBundle, noteIndex: number) => {
    noteBundle.notes[noteIndex].checkedAt = !noteBundle.notes[noteIndex].checkedAt
      ? dayjs().toISOString()
      : null
    NotesStore.save(noteBundle)
  }, [])

  const openEditorForNote = useCallback(
    (noteBundleIndex: number, noteIndex: number) =>
      dispatchEditorState({ type: 'EDIT', noteBundleIndex, noteIndex }),
    [dispatchEditorState],
  )

  const noteBundle =
    editorState.noteBundleIndex !== undefined ? noteBundles[editorState.noteBundleIndex] : undefined

  return (
    <Screen>
      <Controls searchValue={searchTerm} onSearchChange={setSearchTerm} minimize={minimizeSearch} />
      <NotesFeed
        noteBundles={noteBundles}
        onDoneTogglePress={onDoneTogglePress}
        onEditPress={openEditorForNote}
        onHashtagPress={setSearchTerm}
      />
      <NoteEditor
        isOpen={editorState.open}
        onOpen={() => dispatchEditorState({ type: 'OPEN' })}
        onSave={() => dispatchEditorState({ type: 'NEXT' })}
        onClose={() => dispatchEditorState({ type: 'CLOSE' })}
        noteBundle={noteBundle}
        noteIndex={editorState.noteIndex}
      />
    </Screen>
  )
}

function useNoteBundles(searchTerm?: string) {
  const [noteBundles, setNoteBundles] = useState<NoteBundle[]>([])

  const refreshData = useCallback(async () => {
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
  }, [searchTerm])

  useEffect(() => {
    refreshData()
    NotesStore.addChangeListener(refreshData)
    return () => NotesStore.removeChangeListener(refreshData)
  }, [refreshData, searchTerm])

  return noteBundles
}

interface EditorState {
  open: boolean
  newBundle: boolean
  noteBundleIndex?: number
  noteIndex?: number
}

type EditorAction =
  | {
      type: 'OPEN' | 'CLOSE' | 'NEXT' | 'CLEAR' | 'TOGGLE-BUNDLE'
    }
  | {
      type: 'EDIT'
      noteBundleIndex: number
      noteIndex: number
    }

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, open: true }
    case 'CLOSE':
      return { ...state, open: false }
    case 'EDIT':
      return {
        ...state,
        open: true,
        noteBundleIndex: action.noteBundleIndex,
        noteIndex: action.noteIndex,
      }
    case 'TOGGLE-BUNDLE':
      return { ...state, newBundle: !state.newBundle }
    case 'NEXT':
      return {
        ...state,
        open: true,
        newBundle: false,
        noteBundleIndex: undefined,
        noteIndex: undefined,
      }
    case 'CLEAR':
      return { ...state, noteBundleIndex: undefined, noteIndex: undefined }
    default:
      return state
  }
}

const useEditorReducer = (initialEditorState: EditorState) =>
  useReducer(editorReducer, initialEditorState)

export default NotesScreen
