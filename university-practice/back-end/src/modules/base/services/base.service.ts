import { DocumentData, Firestore, Query } from '@google-cloud/firestore'
import { getUniqueId, time } from 'src/helpers'
import { BaseModel, IBaseService } from '../models'

export class BaseService<T extends BaseModel> implements IBaseService<T> {
  constructor(
    protected readonly firestore: Firestore,
    protected readonly collection: FirebaseFirestore.CollectionReference<T>,
  ) {}

  async create(data: any): Promise<T> {
    try {
      const now = time().toDate()
      const id = getUniqueId()
      const docRef = this.collection.doc(id)

      await docRef.set({
        ...data,
        createdAt: now,
        updatedAt: now,
      })

      const doc = await docRef.get()
      return { id: doc.id, ...(doc.data() as T) }
    } catch (error) {
      throw new Error('Failed to create document:' + error)
    }
  }

  async findAll(): Promise<T[]> {
    try {
      let query: Query<T, DocumentData> = this.collection

      const snapshot = await query.get()

      if (snapshot.empty) {
        //throw new Error('No documents found')
        return []
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as T),
      }))
    } catch (error) {
      throw new Error('Failed get documents:' + error)
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const doc = await this.collection.doc(id).get()
      if (!doc.exists) {
        throw new Error(`Document with id ${id} not found`)
      }
      return doc.exists ? { id: doc.id, ...(doc.data() as T) } : null
    } catch (error) {
      console.error(`Error fetching document with id ${id}:`, error)
      throw new Error('Failed to retrieve document')
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const now = time().toDate()
      await this.collection.doc(id).update({
        ...data,
        updatedAt: now,
      })
      return this.findById(id)
    } catch (error) {
      console.error(`Error updating document with id ${id}:`, error)
      throw new Error('Failed to update document')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete()
    } catch (error) {
      console.error(`Error deleting document with id ${id}:`, error)
      throw new Error('Failed to delete document')
    }
  }
}
