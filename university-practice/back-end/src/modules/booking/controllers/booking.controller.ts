import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { Roles } from 'src/modules/auth/decorators/roles.decorator'
import { User } from 'src/modules/auth/decorators/user.decorator'
import { FirebaseAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { RolesGuard } from 'src/modules/auth/guards/roles.guard'
import { CreateBookingDto } from '../dtos/create-booking.dto'
import { Booking } from '../models/booking'
import { BookingService } from '../services/booking.service'

@Controller('bookings')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles('USER', 'ADMIN')
  async createBooking(@Body() dto: CreateBookingDto, @User() user: any) {
    try {
      return await this.bookingService.createBooking(dto, user)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create booking',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Get()
  @Roles('USER', 'ADMIN')
  async findAllBooking(@User() user: any): Promise<Booking[]> {
    try {
      return this.bookingService.findAllBookingsFiltered(user.uid)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to get all bookings',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Delete(':id')
  @Roles('USER', 'ADMIN')
  async deleteBooking(@Param('id') id: string, @User() user: any) {
    try {
      return await this.bookingService.deleteBooking(id, user)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete favorite',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
