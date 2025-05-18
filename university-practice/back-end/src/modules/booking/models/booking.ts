import { BaseModel } from 'src/modules/base/models'
import { MoviesSession } from 'src/modules/movies-session/models/movies-session'
import { User } from 'src/modules/users/models/user'

export class Booking extends BaseModel {
  session: MoviesSession
  user: User
  seats: number[]
  totalPrice: number
}
