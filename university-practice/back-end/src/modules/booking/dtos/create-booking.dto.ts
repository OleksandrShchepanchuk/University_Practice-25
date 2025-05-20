import { IsArray, IsNotEmpty, IsPositive, IsString, ArrayNotEmpty, IsInt } from 'class-validator'

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  seats: number[]

  @IsPositive()
  totalPrice: number
}
