import { Type } from 'class-transformer'
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  ValidateNested,
  ArrayUnique,
  IsInt,
} from 'class-validator'
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
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto

  @IsOptional()
  @IsInt()
  @IsPositive()
  maxSeats?: number

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  bookedSeats?: number[]
}
