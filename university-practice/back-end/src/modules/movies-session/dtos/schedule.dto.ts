import { ArrayNotEmpty, IsArray, IsDateString, IsString } from 'class-validator'

export class ScheduleDto {
  @IsDateString()
  date: string

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  times: string[]
}
