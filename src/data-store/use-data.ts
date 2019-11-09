import React, {useRef, useState, useEffect, useContext, EffectCallback} from 'react'
import NotesStore from './data-store'
import {noteBundle, unsavedNoteBundle} from './data-types'
import {useMountEffect} from 'utils'

const useForceUpdate = () => {
  const [value, setValue] = useState(true)
  return () => setValue(prevValue => !prevValue)
}

export const useGetNoteBundle = (id: number): [noteBundle | undefined, () => Promise<void>] => {
  const forceUpdate = useForceUpdate()
  const [noteBundle, setNoteBundle] = useState<noteBundle>()

  const refresh = async () => {
    const notesStore = NotesStore.getInstance()
    const updatedNoteBundle = await notesStore.get(id)
    if (updatedNoteBundle !== null) setNoteBundle(updatedNoteBundle)
  }

  useMountEffect(() => {
    refresh()
  })

  return [noteBundle, refresh]
}

/** Returns all not bundles in state. */
export const useNoteBundles = (): [noteBundle[], () => Promise<void>] => {
  // const notesStore = useNotesStore()
  const forceUpdate = useForceUpdate()
  const [noteBundles, setNoteBundles] = useState<noteBundle[]>([])

  const refresh = async () => {
    const notesStore = NotesStore.getInstance()
    const updatedNoteBundles = await notesStore.all()

    setNoteBundles(updatedNoteBundles)
    forceUpdate()
  }

  useMountEffect(() => {
    refresh()
  })

  return [noteBundles, refresh]
}

export const useFilterNoteBundles = (filter: (item: noteBundle, index: number) => any) => {
  const [noteBundles, setNoteBundles] = useState<noteBundle[]>()

  const refresh = async () => {
    const notesStore = NotesStore.getInstance()
    const updatedNoteBundles = await notesStore.filter(filter)
    if (updatedNoteBundles !== null) setNoteBundles(updatedNoteBundles)
  }

  useMountEffect(() => {
    refresh()
  })

  return [noteBundles, refresh]
}

export const useSaveNoteBundle = () => {
  // const notesStore = useNotesStore()
  return async (noteBundle: unsavedNoteBundle) => {
    const notesStore = NotesStore.getInstance()
    notesStore.save(noteBundle)
  }
}
