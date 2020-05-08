import React, { useState, useReducer, useEffect, useCallback, useRef } from "react"
import { FlatList } from "react-native"
import Screen from "./screen"
import { Controls } from "components/controls"
import { NotesFeed } from "components/notes-feed"
import { NoteEditor } from "components/note-editor"
import { NotesStore } from "data-store"
import { NoteBundle } from "data-store/data-types"
import { useOnAppOpen } from "utils"
import dayjs from "dayjs"
import produce from "immer"
import FuzzySearch from "fuzzy-search"

type ScreenFocus = "search" | "feed" | "editor"
type DraftIndex = number | null | "new"
type DraftNoteIndexes = [DraftIndex, DraftIndex]
type FilterOptions = "unchecked" | "all"

function NotesScreen() {
  const [noteBundles, setNoteBundles] = useState<NoteBundle[]>([])
  const [screenFocus, setScreenFocus] = useState<ScreenFocus>("editor")
  const [searchPhrase, setSearchPhrase] = useState("")
  const [filterOption, setFilterOption] = useState<FilterOptions>("unchecked")
  const [draftNoteIndexes, setDraftNoteIndexes] = useState<DraftNoteIndexes>(["new", "new"])

  useOnAppOpen(() => {
    // Quick-draw that editor if not searching ;)
    if (screenFocus === "feed" && !searchPhrase) setScreenFocus("editor")
  })

  const refreshData = useCallback(async () => {
    const at1DaysAgo = dayjs().subtract(1, "day")
    let notesData: NoteBundle[]

    if (filterOption === "all") notesData = await NotesStore.all()
    else {
      notesData = await NotesStore.filter(noteBundle =>
        noteBundle.notes.some(
          note => note.checkedAt === null || dayjs(note.checkedAt).isAfter(at1DaysAgo),
        ),
      )
    }

    if (searchPhrase) {
      const searcher = new FuzzySearch(notesData, ["notes.text"])
      notesData = searcher.search(searchPhrase)
    }

    setNoteBundles(notesData.reverse())
  }, [filterOption, searchPhrase])

  useEffect(() => {
    refreshData()
    NotesStore.addChangeListener(refreshData)
    return () => NotesStore.removeChangeListener(refreshData)
  }, [refreshData])

  const notesFeedRef = useRef<FlatList>(null)

  const focusEditor = () => {
    setDraftNoteIndexes(prevIndexes => (prevIndexes[0] === null ? ["new", "new"] : prevIndexes))
    setScreenFocus("editor")
  }

  const openEditorTo = (noteBundleIndex: number, noteIndex: number) => {
    setDraftNoteIndexes([noteBundleIndex, noteIndex])
    focusEditor()
  }

  const focusFeed = () => {
    setDraftNoteIndexes([null, null])
    setScreenFocus("feed")
  }
  const focusSearch = () => setScreenFocus("search")

  const onSave = () => {
    setDraftNoteIndexes(prevIndexes => {
      if (prevIndexes[1] === "new") return [0, "new"]
      return ["new", "new"]
    })
  }

  const toggleBundle = () => {
    if (draftNoteIndexes[0] === "new" && noteBundles.length) setDraftNoteIndexes([0, "new"])
    else setDraftNoteIndexes(["new", "new"])
  }

  const onDoneTogglePress = useCallback((noteBundle: NoteBundle, noteIndex: number) => {
    const tempNoteBundle = produce(noteBundle, draftNoteBundle => {
      draftNoteBundle.notes[noteIndex].checkedAt = !draftNoteBundle.notes[noteIndex].checkedAt
        ? dayjs().toISOString()
        : null
    })
    NotesStore.save(tempNoteBundle)
  }, [])

  const noteBundle =
    typeof draftNoteIndexes[0] === "number" ? noteBundles[draftNoteIndexes[0]] : null

  return (
    <Screen>
      <Controls
        searchValue={searchPhrase}
        onSearchChange={setSearchPhrase}
        minimize={false}
        onFocus={focusSearch}
      />

      <NotesFeed
        ref={notesFeedRef}
        noteBundles={noteBundles}
        onDoneTogglePress={onDoneTogglePress}
        onEditPress={openEditorTo}
        onHashtagPress={setSearchPhrase}
        draftNoteIndexes={draftNoteIndexes}
      />

      <NoteEditor
        isOpen={screenFocus === "editor"}
        onFocus={focusEditor}
        onSave={onSave}
        onBlur={focusFeed}
        noteBundle={noteBundle}
        noteIndex={draftNoteIndexes[1]}
        toggleNewBundle={toggleBundle}
      />
    </Screen>
  )
}

// function useNoteBundles(searchTerm?: string) {
//   const [noteBundles, setNoteBundles] = useState<NoteBundle[]>([])

//   const refreshData = useCallback(async () => {
//     let notesData: NoteBundle[]
//     if (searchTerm) {
//       const regex = RegExp(searchTerm.split(" ").join("|"), "gi")
//       notesData = await NotesStore.filter((noteBundle: NoteBundle) => {
//         // memory.matches is the negative of how many times the substring is found
//         // which is used for the sortBy below. Negative is used to sort desc.
//         noteBundle.matches = (noteBundle.notes[0].text.match(regex) || []).length
//         return noteBundle.matches > 0
//       })
//       //  _.sortBy(memories, (memory) => (-1 * memory.matches))
//     } else notesData = await NotesStore.all()

//     setNoteBundles(notesData.reverse())
//   }, [searchTerm])

//   useEffect(() => {
//     refreshData()
//     NotesStore.addChangeListener(refreshData)
//     return () => NotesStore.removeChangeListener(refreshData)
//   }, [refreshData, searchTerm])

//   return noteBundles
// }

// type EditIndex = number | null
// type DisplayState = "open" | "closed" | "hidden"

// interface PageState {
//   noteBundles: NoteBundle[]
//   display: "search" | "feed" | "editor"
//   searchTerm: string
//   editNoteIndexes: [EditIndex, EditIndex] // -1 for new
//   editorNote: string
// }

// getNoteBundles() -> updates noteBundles
// searchNoteBundles(searchTerm) -> updates noteBundles
// setDraft(noteBundleIndexes) -> updates noteBundles
// setDraft(noteBundleIndexes) -> updates noteBundles

// Open/focus search
// Update searchTerm
// Update noteBundles with search

// Open/focus Editor (new bundle) - Close search
// Switch Editor to prev bundle
//

// interface EditorState {
//   open: boolean
//   newBundle: boolean
//   isEditing: boolean
//   noteBundleIndex?: number
//   noteIndex?: number
// }

// type EditorAction =
//   | {
//       type: "OPEN" | "CLOSE" | "NEXT" | "CLEAR" | "TOGGLE-BUNDLE"
//     }
//   | {
//       type: "EDIT"
//       noteBundleIndex: number
//       noteIndex: number
//     }

// function editorReducer(state: EditorState, action: EditorAction): EditorState {
//   switch (action.type) {
//     case "OPEN":
//       return { ...state, open: true }
//     case "CLOSE":
//       return { ...state, open: false }
//     case "EDIT":
//       return {
//         ...state,
//         open: true,
//         noteBundleIndex: action.noteBundleIndex,
//         noteIndex: action.noteIndex,
//         isEditing: true,
//       }
//     case "TOGGLE-BUNDLE":
//       return { ...state, newBundle: !state.newBundle }
//     case "NEXT":
//       return {
//         ...state,
//         open: true,
//         newBundle: false,
//         isEditing: false,
//         noteIndex: state.noteIndex !== undefined ? state.noteIndex + 1 : 0,
//       }
//     case "CLEAR":
//       return { ...state, isEditing: false, noteBundleIndex: undefined, noteIndex: undefined }
//     default:
//       return state
//   }
// }

// const useEditorReducer = (initialEditorState: EditorState) =>
//   useReducer(editorReducer, initialEditorState)

export default NotesScreen
