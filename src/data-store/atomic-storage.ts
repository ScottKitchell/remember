import AsyncStorage from '@react-native-community/async-storage'

export interface Data {
  id: number
}

type Unsaved<T> = Omit<T, 'id'> & {
  id?: number
}

type Listener = () => unknown

export default class AtomicStorage<T extends Data> {
  static existingInstances: {[key: string]: AtomicStorage<any>} = {}

  public readonly storeName: string

  private data = new Map<number, T>([])

  private listeners = new Set<Listener>([])

  public get size() {
    return this.data.size
  }

  static init<U extends Data>(storeName: string) {
    if (!AtomicStorage.existingInstances[storeName]) {
      AtomicStorage.existingInstances[storeName] = new AtomicStorage<U>(storeName)
    }

    return AtomicStorage.existingInstances[storeName] as AtomicStorage<U>
  }

  constructor(storeName: string) {
    this.storeName = storeName
    this.syncFromPersistentStorage()
  }

  async all() {
    await this.ensureDataHasSynced()

    return [...this.data.values()]
  }

  async get(id: number) {
    await this.ensureDataHasSynced()

    const item = this.data.get(id)
    if (item === undefined)
      console.error(`The id ${id} does not exist in the ${this.storeName} Store.`)

    return item
  }

  async filter(...filter: Parameters<T[]['filter']>) {
    await this.ensureDataHasSynced()

    return [...this.data.values()].filter(...filter)
  }

  async save(item: Unsaved<T>) {
    await this.ensureDataHasSynced()

    const id = item.id ?? this.nextId()

    this.data.set(id, {...item, id} as T)
    console.log(`Saved (ID: ${id})`, item)

    this.notifyAllListeners()
    this.syncToPersistentStorage()
  }

  async delete(id: number) {
    await this.ensureDataHasSynced()

    if (this.data.delete(id)) {
      console.log('Deleted')
      this.notifyAllListeners()
      this.syncToPersistentStorage()
    } else {
      console.error(
        `Nothing was deleted as the id ${id} did not exist in the ${this.storeName} Store.`,
      )
    }
  }

  private nextId = () => {
    return this.data.size ? Array.from(this.data.keys())[this.data.size - 1] + 1 : 0
  }

  private async syncToPersistentStorage() {
    const dataString = JSON.stringify([...this.data])
    try {
      await AsyncStorage.setItem(this.storeName, dataString)
      console.log(`Sync ${this.storeName} Store to AsyncStorage`)
    } catch (error) {
      console.error(`Error syncing ${this.storeName} Store to AsyncStorage:`, error)
    }
  }

  private async syncFromPersistentStorage() {
    try {
      const dataString = await AsyncStorage.getItem(this.storeName)
      this.data = new Map(dataString ? JSON.parse(dataString) : [])
      console.log(`Synced ${this.storeName} Store from AsyncStorage`)
    } catch (error) {
      console.error(`Error syncing ${this.storeName} Store from AsyncStorage:`, error)
    }
  }

  private async ensureDataHasSynced() {
    if (this.data.size === 0) {
      return this.syncFromPersistentStorage()
    }
  }

  async clear() {
    this.data.clear()
    await this.syncToPersistentStorage()
  }

  public addChangeListener(handler: Listener) {
    this.listeners.add(handler)
  }

  public removeChangeListener(handler: Listener) {
    this.listeners.delete(handler)
  }

  private notifyAllListeners() {
    this.listeners.forEach(handler => handler())
  }
}
