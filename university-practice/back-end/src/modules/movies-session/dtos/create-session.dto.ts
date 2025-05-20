import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator'
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

  @IsOptional()
  @IsPositive()
  @IsNumber()
  maxSeats: number = 30

  @IsOptional()
  @IsArray()
  bookedSeats: number[] = []
}
