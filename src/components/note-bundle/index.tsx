import React from "react"
import styled from "styled-components/native"
import { NoteBundle, Note } from "data-store/data-types"
import { BundleAvatar } from "./bundle-avatar"
import { NoteRow } from "./note"
import dayjs from "dayjs"
import calendar from "dayjs/plugin/calendar"
import { colors } from "theme"

dayjs.extend(calendar)

interface NoteBundleProps {
  noteBundle: NoteBundle
  draftIndex: number | null | "new"
  onDoneTogglePress: (noteIndex: number, note: Note) => any
  onEditPress: (noteIndex: number, note: Note) => any
  onHashtagPress: (hashtag: string) => any
}

export const NoteBundleListItem = (props: NoteBundleProps) => {
  const isItemADraft = (i: number) =>
    props.draftIndex === i ||
    (props.draftIndex === "new" && i === props.noteBundle.notes.length - 1)

  const isItemADraft2 = (i: number, note: Note) => {
    const draft = isItemADraft(i)
    return draft
  }

  return (
    <NoteBundleContainer>
      <BundleInfo noteBundle={props.noteBundle} />

      <BundleDetailsContainer>
        <AvatarCol>
          <BundleAvatar creationType={props.noteBundle.creationType} />
        </AvatarCol>

        <NotesCol>
          {props.noteBundle.notes.map((note, i) => (
            <NoteRow
              key={i}
              note={note}
              isFirst={i === 0}
              isLast={i === props.noteBundle.notes.length - 1}
              onDoneTogglePress={() => props.onDoneTogglePress(i, note)}
              onEditPress={() => props.onEditPress(i, note)}
              onHashtagPress={props.onHashtagPress}
              isDraft={isItemADraft2(i, note)}
            />
          ))}
        </NotesCol>
      </BundleDetailsContainer>
    </NoteBundleContainer>
  )
}

const NoteBundleContainer = styled.View`
  padding: 5px 15px;
`

const BundleDetailsContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`

const AvatarCol = styled.View`
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
`

const NotesCol = styled.View`
  flex: 1;
`

interface BundleInfoProps {
  noteBundle: NoteBundle
}

const BundleInfo = (props: BundleInfoProps) => {
  const createdAt = dayjs(props.noteBundle.createdAt).calendar()

  return (
    <BundleInfoContainer>
      <BundleInfoText>{createdAt}</BundleInfoText>
    </BundleInfoContainer>
  )
}

const BundleInfoContainer = styled.View`
  align-items: center;
  padding: 4px 8px;
`
const BundleInfoText = styled.Text`
  color: ${colors.textDarkFaint};
  font-size: 12px;
`
