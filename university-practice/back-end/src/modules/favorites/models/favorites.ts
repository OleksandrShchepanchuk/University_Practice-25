import { BaseModel } from 'src/modules/base/models'
import { Movie } from 'src/modules/movies/models/movie'
import { User } from 'src/modules/users/models/user'

export class Favorites extends BaseModel {
  user: User
  movie: Movie
}
