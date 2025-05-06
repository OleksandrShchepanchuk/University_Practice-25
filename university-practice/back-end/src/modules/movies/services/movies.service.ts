import { Inject, Injectable } from '@nestjs/common'
import { Firestore } from 'firebase-admin/firestore'
import { BaseService } from 'src/modules/base/services/base.service'
import { FirestoreDatabaseProvider } from 'src/providers'
import { Movie } from '../models/movie'

@Injectable()
export class MovieService extends BaseService<Movie> {
  constructor(@Inject(FirestoreDatabaseProvider) repository: Firestore) {
    super(repository, repository.collection('movies') as FirebaseFirestore.CollectionReference<Movie>)
  }
}
