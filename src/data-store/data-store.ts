import AsyncStorage from '@react-native-community/async-storage'
import {noteBundle, unsavedNoteBundle} from 'data-store/data-types'

export default class NotesStore {
  static mangerInstance: NotesStore | null = null

  private storeName = 'notes-store'

  private data: noteBundle[] = []

  /** @returns {NotesStore} */
  static getInstance(): NotesStore {
    if (NotesStore.mangerInstance === null) {
      NotesStore.mangerInstance = new NotesStore()
    }

    return NotesStore.mangerInstance
  }

  async all() {
    // await this.purge()
    await this.ensureDataHasSynced()

    return this.data
  }

  async get(id: number) {
    await this.ensureDataHasSynced()

    const noteBundle = this.data.find(storedNoteBundle => storedNoteBundle.id === id)
    if (noteBundle === null) throw `The id ${id} did not exist in the NotesStore.`
    return noteBundle
  }

  async filter(filterFunc: (item: any, index: number) => any) {
    await this.ensureDataHasSynced()

    return this.data.filter(filterFunc)
  }

  async save(noteBundle: unsavedNoteBundle) {
    await this.ensureDataHasSynced()

    if (noteBundle.id !== null && noteBundle.id !== undefined) {
      // Updating noteBundle
      const index = this.data.findIndex(storedNoteBundle => storedNoteBundle.id === noteBundle.id)
      this.data.splice(index, 1, <noteBundle>noteBundle) // already of type noteBundle
      console.log('Updated', noteBundle)
    } else {
      // Creating noteBundle
      const id = this.createId()
      const createdNoteBundle = {...noteBundle, id}
      this.data.unshift(createdNoteBundle)
      console.log('Created', createdNoteBundle)
    }

    this.syncToPersistentStorage()
  }

  async delete(id: number) {
    await this.ensureDataHasSynced()
    const index = this.data.findIndex(storedNoteBundle => storedNoteBundle.id === id)
    if (index < 0) {
      console.error(`Nothing was deleted as the id ${id} did not exist in the NotesStore.`)
      return
    }
    this.data.splice(index, 1)
    console.log('Deleted')
    this.syncToPersistentStorage()
  }

  private createId = () => {
    return this.data.length ? this.data[0].id + 1 : 0
  }

  private async syncToPersistentStorage() {
    const dataString = JSON.stringify(this.data)
    try {
      await AsyncStorage.setItem(this.storeName, dataString)
      console.log('Sync to AsyncStorage')
    } catch (error) {
      console.error('Error syncing NotesStore to AsyncStorage:', error)
    }
  }

  private async syncFromPersistentStorage() {
    try {
      const dataString = await AsyncStorage.getItem(this.storeName)
      this.data = dataString ? JSON.parse(dataString) : []
      console.log('Sync from AsyncStorage')
    } catch (error) {
      console.error('Error syncing NotesStore from AsyncStorage:', error)
    }
  }

  private async ensureDataHasSynced() {
    if (!this.data.length) {
      return this.syncFromPersistentStorage()
    }
  }

  async purge() {
    this.data = []
    await this.syncToPersistentStorage()
  }
}
