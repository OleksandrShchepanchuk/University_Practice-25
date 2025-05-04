import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator'
import { ScheduleDto } from './schedule.dto'

export class CreateMoviesSessionDto {
  @IsString()
  @IsNotEmpty()
  movieId: string

  @IsPositive()
  @IsNumber()
  price: number

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedule: ScheduleDto[]
}
