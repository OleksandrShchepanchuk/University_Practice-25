import { BaseModel } from 'src/modules/base/models'
import { Movie } from 'src/modules/movies/models/movie'
import { Schedule } from './schedule'

export class MoviesSession extends BaseModel {
  static collectionName = 'movies-session'

  movie: Movie
  price: number
  schedule: Schedule[]
}
