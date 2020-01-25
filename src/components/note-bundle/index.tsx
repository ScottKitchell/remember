import React from 'react'
import styled from 'styled-components/native'
import { NoteBundle, Note } from 'data-store/data-types'
import { BundleAvatar } from './bundle-avatar'
import { NoteRow } from './note'

interface NoteBundleProps {
  noteBundle: NoteBundle
  onDoneTogglePress: (noteIndex: number, note: Note) => any
  onEditPress: (noteIndex: number, note: Note) => any
}

export const NoteBundleListItem = ({
  noteBundle,
  onDoneTogglePress,
  onEditPress,
}: NoteBundleProps) => {
  return (
    <NoteBundleContainer>
      <BundleInfo noteBundle={noteBundle} />

      <BundleDetailsContainer>
        <AvatarCol>
          <BundleAvatar creationType={noteBundle.creationType} />
        </AvatarCol>

        <NotesCol>
          <Notes
            notes={noteBundle.notes}
            onDoneTogglePress={onDoneTogglePress}
            onEditPress={onEditPress}
          />
        </NotesCol>
      </BundleDetailsContainer>
    </NoteBundleContainer>
  )
}

const NoteBundleContainer = styled.View`
  padding: 15px;
`

const BundleDetailsContainer = styled.View`
  display: flex;
  flex-direction: row;
`

const AvatarCol = styled.View`
  flex-grow: 0;
`

const NotesCol = styled.View`
  flex: 1;
`

interface BundleInfoProps {
  noteBundle: NoteBundle
}

const BundleInfo = ({ noteBundle }: BundleInfoProps) => {
  return (
    <BundleInfoContainer>
      <BundleInfoText>{noteBundle.createdAt}</BundleInfoText>
    </BundleInfoContainer>
  )
}

const BundleInfoContainer = styled.View`
  align-items: center;
  padding: 8px;
`
const BundleInfoText = styled.Text`
  color: #aaa;
  text-align: center;
  font-size: 12px;
`

interface NotesProps {
  notes: Note[]
  onDoneTogglePress: (noteIndex: number, note: Note) => any
  onEditPress: (noteIndex: number, note: Note) => any
}

const Notes = ({ notes, onDoneTogglePress, onEditPress }: NotesProps) => {
  return (
    <>
      {notes.map((note, i) => (
        <NoteRow
          key={i || 'new'}
          note={note}
          isFirst={i === 0}
          isLast={i === notes.length - 1}
          onDoneTogglePress={() => onDoneTogglePress(i, note)}
          onEditPress={() => onEditPress(i, note)}
        />
      ))}
    </>
  )
}
