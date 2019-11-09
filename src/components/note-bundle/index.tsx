import React from 'react'
import styled from 'styled-components/native'
import {colors} from 'theme'
import {noteBundle, note} from 'data-store/data-types'
import {BundleAvatar} from './bundle-avatar'
import {Note} from './note'

interface NoteBundleProps {
  noteBundle: noteBundle
  onDoneTogglePress: (noteIndex: number, note: note) => any
  onEditPress: (noteIndex: number, note: note) => any
}

export const NoteBundle = ({noteBundle, onDoneTogglePress, onEditPress}: NoteBundleProps) => {
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
  noteBundle: noteBundle
}

const BundleInfo = ({noteBundle}: BundleInfoProps) => {
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
  notes: note[]
  onDoneTogglePress: (noteIndex: number, note: note) => any
  onEditPress: (noteIndex: number, note: note) => any
}

const Notes = ({notes, onDoneTogglePress, onEditPress}: NotesProps) => {
  return (
    <>
      {notes.map((note, i) => (
        <Note
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
