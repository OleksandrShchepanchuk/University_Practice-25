import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string

  @IsInt()
  @IsPositive()
  seats: number

  @IsInt()
  @IsPositive()
  totalPrice: number
}
