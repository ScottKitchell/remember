import AtomicStorage from './atomic-storage'
import { NoteBundle } from './data-types'

/**
 * Retrieve and save NoteBundles.
 */
export const NotesStore = AtomicStorage.init<NoteBundle>('note-bundle')
