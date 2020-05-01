export interface Note {
  text: string
  createdAt: string
  modifiedAt: string
  checkedAt: string | null
}

export interface NoteBundle {
  id: number
  notes: Note[]
  createdAt: string
  creationType: "user" | "reminder"
  matches?: boolean
}

export interface UnsavedNoteBundle extends Omit<NoteBundle, "id"> {
  id?: number
}
