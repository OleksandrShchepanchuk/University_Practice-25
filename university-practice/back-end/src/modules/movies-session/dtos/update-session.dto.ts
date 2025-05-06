import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsNumber, IsObject, IsOptional, IsPositive, ValidateNested } from 'class-validator'
import { UpdateMovieDto } from 'src/modules/movies/dtos/update-movie.dto'
import { ScheduleDto } from './schedule.dto'

export class UpdateMoviesSessionDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateMovieDto)
  movie?: UpdateMovieDto

  @IsOptional()
  @IsPositive()
  @IsNumber()
  price?: number

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto[]
}
