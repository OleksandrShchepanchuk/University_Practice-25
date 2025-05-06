import { Firestore } from '@google-cloud/firestore'
import { Inject, Injectable } from '@nestjs/common'
import { time } from 'src/helpers'
import { BaseService } from 'src/modules/base/services/base.service'
import { MoviesSession } from 'src/modules/movies-session/models/movies-session'
import { User } from 'src/modules/users/models/user'
import { FirestoreDatabaseProvider } from 'src/providers'
import { CreateBookingDto } from '../dtos/create-booking.dto'
import { Booking } from '../models/booking'

@Injectable()
export class BookingService extends BaseService<Booking> {
  constructor(@Inject(FirestoreDatabaseProvider) repository: Firestore) {
    super(repository, repository.collection('booking') as FirebaseFirestore.CollectionReference<Booking>)
  }

  async createBooking(dto: CreateBookingDto, userMeta: any): Promise<Booking> {
    try {
      const now = time().toDate()

      const sessionDoc = await this.firestore.collection('movies-session').doc(dto.sessionId).get()

      if (!sessionDoc.exists) {
        throw new Error('Session not found')
      }

      const session = sessionDoc.data() as MoviesSession

      const userDoc = await this.firestore.collection('users').doc(userMeta.uid).get()

      if (!userDoc.exists) {
        throw new Error('User not found')
      }

      const user = userDoc.data() as User

      const data: Booking = {
        user: { id: userMeta.uid, ...user },
        session: { id: dto.sessionId, ...session },
        seats: dto.seats,
        totalPrice: dto.totalPrice,
        createdAt: now,
        updatedAt: now,
      }

      const docRef = await this.collection.add(data)
      const snapshot = await docRef.get()

      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Booking
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllBookingsFiltered(userId: string): Promise<Booking[]> {
    try {
      let query: FirebaseFirestore.Query<Booking> = this.collection

      const userDoc = await this.firestore
        .collection('users')
        .doc(userId as string)
        .get()

      if (!userDoc.exists) {
        throw new Error('User not found')
      }

      const user = userDoc.data() as User

      if (userId && !(user.roles === 'ADMIN')) {
        query = query.where('user.id', '==', userId)
      }

      const snapshot = await query.get()
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Booking)
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteBooking(id: string, userMeta: any) {
    try {
      const userId = userMeta.uid

      const docRef = this.collection.doc(id)
      const docSnapshot = await docRef.get()

      if (!docSnapshot.exists) {
        throw new Error('Favorite not found')
      }

      const booking = docSnapshot.data() as Booking

      if (!booking.user || booking.user.id !== userId) {
        throw new Error('Forbidden: You are not allowed to delete this favorite')
      }

      if (userMeta.roles === 'ADMIN' || booking.user.id === userId) {
        await docRef.delete()
        return { message: 'Booking successfully deleted', id }
      } else {
        throw new Error('Forbidden: You are not allowed to delete this favorite')
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
