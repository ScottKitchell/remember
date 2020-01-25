import AtomicStorage from './atomic-storage'
import {NoteBundle, UnsavedNoteBundle, Data} from './data-types'

/**
 * Retrieve and save NoteBundles.
 */
export const NotesStore = AtomicStorage.init<NoteBundle>('note-bundle')
