export interface note {
  text: string
  checked: boolean
  createdAt: string
}

interface _noteBundle {
  notes: note[]
  createdAt: string
  creationType: 'user' | 'reminder'
}

export interface noteBundle extends _noteBundle {
  id: number
}

export interface unsavedNoteBundle extends _noteBundle {
  id?: number | null
}
