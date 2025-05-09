import { ArrayNotEmpty, IsArray, IsNumber, IsString, IsUrl, Length, Max, Min } from 'class-validator'

export class CreateMovieDto {
  @IsString()
  @Length(1, 255)
  title: string

  @IsUrl()
  poster: string

  @IsString()
  description: string

  @IsString()
  genre: string

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number

  @IsNumber()
  @Min(1900)
  year: number

  @IsUrl()
  trailer: string

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cast: string[]

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  photos: string[]
}
