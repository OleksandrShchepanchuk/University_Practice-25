import { BaseModel } from 'src/modules/base/models'

export class Movie extends BaseModel {
  static collectionName = 'movies'

  title: string
  poster: string
  description: string
  genre: string
  rating: number
  year: number
  trailer: string
  cast: string[]
}
