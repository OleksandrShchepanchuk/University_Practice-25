import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator'
import { ScheduleDto } from './schedule.dto'

export class CreateMoviesSessionDto {
  @IsString()
  @IsNotEmpty()
  movieId: string

  @IsPositive()
  @IsNumber()
  price: number

  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto
}
