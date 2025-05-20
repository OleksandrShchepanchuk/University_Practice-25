import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFavoritesDto {
  @IsString()
  @IsNotEmpty()
  movieId: string
}
