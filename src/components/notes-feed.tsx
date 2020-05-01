import React, { useMemo, forwardRef } from "react"
import { FlatList } from "react-native"
import styled from "styled-components/native"
import { colors } from "theme"
import { NoteBundleListItem } from "components/note-bundle"
import { NoteBundle, Note } from "data-store/data-types"
import produce from "immer"
import dayjs from "dayjs"

type DraftIndex = number | null | "new"
type DraftNoteIndexes = [DraftIndex, DraftIndex]

interface NotesProps {
  noteBundles: NoteBundle[]
  onDoneTogglePress: (noteBundle: NoteBundle, noteIndex: number) => any
  onEditPress: (noteBundleIndex: number, noteIndex: number) => any
  onHashtagPress: (hashtag: string) => void
  draftNoteIndexes: DraftNoteIndexes
}

export const NotesFeed = forwardRef<FlatList, NotesProps>((props, flatListRef) => {
  console.log("NotesFeed: i -->", props.draftNoteIndexes)

  const feedItems = useMemo(() => {
    const draftNoteBundleIndex = props.draftNoteIndexes[0]
    const draftNoteIndex = props.draftNoteIndexes[1]

    const tempNote: Note = {
      text: "...",
      createdAt: "",
      modifiedAt: "",
      checkedAt: "",
    }

    if (typeof draftNoteBundleIndex === "number" && draftNoteIndex === "new") {
      return produce(props.noteBundles, draftNoteBundles => {
        draftNoteBundles[0].notes.push(tempNote)
      })
    }

    if (draftNoteBundleIndex === "new") {
      const tempNoteBundle: NoteBundle = {
        id: -1,
        notes: [tempNote],
        createdAt: dayjs().toISOString(),
        creationType: "user",
      }

      return produce(props.noteBundles, draftNoteBundles => {
        draftNoteBundles.unshift(tempNoteBundle)
      })
    }

    return props.noteBundles
  }, [props.draftNoteIndexes, props.noteBundles])

  const getDraftIndex = (noteBundleIndex: number) =>
    noteBundleIndex === props.draftNoteIndexes[0] ||
    (props.draftNoteIndexes[0] === "new" && noteBundleIndex === 0)
      ? props.draftNoteIndexes[1]
      : null

  return (
    <NotesKeyboardAvoidingView>
      <NotesFlatList
        ref={flatListRef}
        data={feedItems}
        renderItem={({ item, index }) => (
          <NoteBundleListItem
            noteBundle={item}
            onDoneTogglePress={noteIndex => props.onDoneTogglePress(item, noteIndex)}
            onEditPress={noteIndex => props.onEditPress(index, noteIndex)}
            onHashtagPress={props.onHashtagPress}
            draftIndex={getDraftIndex(index)}
          />
        )}
        keyExtractor={noteBundle => noteBundle.id.toString()}
        inverted={true}
      />
    </NotesKeyboardAvoidingView>
  )
})

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
