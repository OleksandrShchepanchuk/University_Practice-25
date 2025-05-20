import { IsDateString, IsString } from 'class-validator'

export class ScheduleDto {
  @IsDateString()
  date: string

  @IsString()
  times: string
}
