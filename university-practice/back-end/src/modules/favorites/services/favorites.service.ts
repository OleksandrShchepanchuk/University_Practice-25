import { Firestore } from '@google-cloud/firestore'
import { Inject, Injectable } from '@nestjs/common'
import { time } from 'src/helpers'
import { BaseService } from 'src/modules/base/services/base.service'
import { Movie } from 'src/modules/movies/models/movie'
import { User } from 'src/modules/users/models/user'
import { FirestoreDatabaseProvider } from 'src/providers'
import { CreateFavoritesDto } from '../dtos/create-favorites.dto'
import { Favorites } from '../models/favorites'

@Injectable()
export class FavoritesService extends BaseService<Favorites> {
  constructor(@Inject(FirestoreDatabaseProvider) repository: Firestore) {
    super(repository, repository.collection('favorites') as FirebaseFirestore.CollectionReference<Favorites>)
  }

  async createFavorites(dto: CreateFavoritesDto, userMeta: any): Promise<Favorites> {
    try {
      const now = time().toDate()

      const movieDoc = await this.firestore.collection('movies').doc(dto.movieId).get()

      if (!movieDoc.exists) {
        throw new Error('Movie not found')
      }

      const movie = movieDoc.data() as Movie

      const userDoc = await this.firestore.collection('users').doc(userMeta.uid).get()

      if (!userDoc.exists) {
        throw new Error('User not found')
      }

      const user = userDoc.data() as User

      const data: Favorites = {
        user: { id: userMeta.uid, ...user },
        movie: { id: dto.movieId, ...movie },
        createdAt: now,
        updatedAt: now,
      }

      const docRef = await this.collection.add(data)
      const snapshot = await docRef.get()

      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Favorites
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAllFavorites(userMeta: any): Promise<Favorites[]> {
    try {
      let query: FirebaseFirestore.Query<Favorites> = this.collection

      const userId = userMeta.uid

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
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Favorites)
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteFavorite(id: string, userMeta: any) {
    try {
      const userId = userMeta.uid

      const docRef = this.collection.doc(id)
      const docSnapshot = await docRef.get()

      if (!docSnapshot.exists) {
        throw new Error('Favorite not found')
      }

      const favorite = docSnapshot.data() as Favorites

      if (!favorite.user || favorite.user.id !== userId) {
        throw new Error('Forbidden: You are not allowed to delete this favorite')
      }

      if (userMeta.roles === 'ADMIN' || favorite.user.id === userId) {
        await docRef.delete()
        return { message: 'Favorite successfully deleted', id }
      } else {
        throw new Error('Forbidden: You are not allowed to delete this favorite')
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
