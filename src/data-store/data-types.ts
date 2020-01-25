export interface Data {
  id: number
}

export interface Note {
  text: string
  checked: boolean
  createdAt: string
}

export interface NoteBundle extends Data {
  notes: Note[]
  createdAt: string
  creationType: 'user' | 'reminder'
}

export interface UnsavedNoteBundle extends Omit<NoteBundle, 'id'> {
  id?: number
}
