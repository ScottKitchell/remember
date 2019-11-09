import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {noteBundle, note} from 'data-store/data-types'
import {colors} from 'theme'
import {Note} from 'components/note'

interface NoteBundleProps {
  noteBundle: noteBundle
  onDoneTogglePress: (noteIndex: number, note: note) => any
  onEditPress: (noteIndex: number, note: note) => any
}

export const NoteBundle = ({noteBundle, onDoneTogglePress, onEditPress}: NoteBundleProps) => {
  return (
    <View style={styles.noteBundle}>
      <BundleInfo noteBundle={noteBundle} />

      <View style={{display: 'flex', flexDirection: 'row'}}>
        <View style={{flexGrow: 0}}>
          <CreationAvatar creationType={noteBundle.creationType} />
        </View>

        <View style={{flex: 1}}>
          <Notes
            notes={noteBundle.notes}
            onDoneTogglePress={onDoneTogglePress}
            onEditPress={onEditPress}
          />
        </View>
      </View>
    </View>
  )
}

interface BundleInfoProps {
  noteBundle: noteBundle
}

const BundleInfo = ({noteBundle}: BundleInfoProps) => {
  return (
    <View style={styles.bundleInfo}>
      <Text style={styles.bundleInfoText}>{noteBundle.createdAt}</Text>
    </View>
  )
}

interface CreationAvatarProps {
  creationType: 'user' | 'reminder'
}

const CreationAvatar = ({creationType}: CreationAvatarProps) => {
  let style = styles.creationAvatar
  if (creationType === 'user') style = {...style, ...styles.creationUserAvatar}
  if (creationType === 'reminder') style = {...style, ...styles.creationReminderAvatar}

  return <View style={style} />
}

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

const styles = StyleSheet.create({
  noteBundle: {
    padding: 15,
  },
  bundleInfo: {
    alignItems: 'center',
    padding: 8,
  },
  bundleInfoText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 12,
  },
  creationAvatar: {
    height: 36,
    width: 36,
    borderRadius: 25,
  },
  creationUserAvatar: {
    backgroundColor: colors.primary,
  },
  creationReminderAvatar: {
    backgroundColor: colors.secondary,
  },
})
