import { Inject, Injectable } from '@nestjs/common'
import { classToPlain } from 'class-transformer'
import { Firestore } from 'firebase-admin/firestore'
import { time } from 'src/helpers'
import { BaseService } from 'src/modules/base/services/base.service'
import { Movie } from 'src/modules/movies/models/movie'
import { FirestoreDatabaseProvider } from 'src/providers'
import { CreateMoviesSessionDto } from '../dtos/create-session.dto'
import { MoviesSession } from '../models/movies-session'
import { Schedule } from '../models/schedule'

@Injectable()
export class MoviesSessionService extends BaseService<MoviesSession> {
  constructor(@Inject(FirestoreDatabaseProvider) repository: Firestore) {
    super(repository, repository.collection('movies-session') as FirebaseFirestore.CollectionReference<MoviesSession>)
  }

  async create(data: CreateMoviesSessionDto): Promise<MoviesSession> {
    try {
      const movieDoc = await this.firestore.collection('movies').doc(data.movieId).get()

      if (!movieDoc.exists) {
        throw new Error('Movie not found')
      }

      const movie = movieDoc.data() as Movie

      const serializeSchedule = classToPlain(data.schedule)
      const movieSessionData = {
        movie: { id: data.movieId, ...movie },
        price: data.price,
        schedule: serializeSchedule as Schedule,
        maxSeats: data.maxSeats ?? 30,
        bookedSeats: data.bookedSeats ?? [],
      }

      const docRef = await this.collection.add(movieSessionData)
      const docSnapshot = await docRef.get()

      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as MoviesSession
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(id: string, data: Partial<MoviesSession>): Promise<MoviesSession | null> {
    try {
      const now = time().toDate()
      const updatePayload: Record<string, any> = {
        updatedAt: now,
      }

      for (const [key, value] of Object.entries(data)) {
        if (key === 'movie' && typeof value === 'object' && value !== null) {
          const flattened = this.flattenObject(value, 'movie')
          Object.assign(updatePayload, flattened)
        } else {
          updatePayload[key] = value
        }
      }

      await this.collection.doc(id).update(updatePayload)

      return this.findById(id)
    } catch (error) {
      console.error(`Error updating document with id ${id}:`, error)
      throw new Error(error)
    }
  }

  private flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(acc, this.flattenObject(value, newKey))
        } else {
          acc[newKey] = value
        }

        return acc
      },
      {} as Record<string, any>,
    )
  }
}
