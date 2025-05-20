import { Inject, Injectable } from '@nestjs/common'
import { Firestore } from 'firebase-admin/firestore'
import { BaseService } from 'src/modules/base/services/base.service'
import { FirestoreDatabaseProvider } from 'src/providers'
import { Movie } from '../models/movie'
import { UpdateMovieDto } from '../dtos/update-movie.dto'

@Injectable()
export class MovieService extends BaseService<Movie> {
  constructor(@Inject(FirestoreDatabaseProvider) private readonly db: Firestore) {
    super(db, db.collection('movies') as FirebaseFirestore.CollectionReference<Movie>)
  }

  async update(id: string, dto: UpdateMovieDto): Promise<Movie> {
    await this.collection.doc(id).update({ ...dto })

    const updatedDoc = await this.collection.doc(id).get()
    const updatedMovie = updatedDoc.data() as Movie

    await this.syncMovieToSessions(updatedMovie)

    return updatedMovie
  }

  private async syncMovieToSessions(updatedMovie: Movie): Promise<void> {
    const sessionsRef = this.db.collection('movies-session')
    const snapshot = await sessionsRef.get()

    const batch = this.db.batch()
    let changed = 0

    snapshot.docs.forEach((doc) => {
      const session = doc.data()
      if (session.movie?.id === updatedMovie.id) {
        batch.update(doc.ref, {
          movie: { ...updatedMovie },
        })
        changed++
      }
    })

    if (changed > 0) {
      await batch.commit()
      console.log(`Synced updated movie "${updatedMovie.title}" to ${changed} session(s).`)
    }
  }
}
