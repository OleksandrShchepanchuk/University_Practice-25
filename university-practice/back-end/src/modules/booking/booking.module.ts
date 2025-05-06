import { Module } from '@nestjs/common'
import { FirestoreModule } from '../../providers'
import { AuthModule } from '../auth/auth.module'
import { BaseModule } from '../base/base.module'
import { BookingController } from './controllers/booking.controller'
import { BookingService } from './services/booking.service'

@Module({
  imports: [AuthModule, FirestoreModule, BaseModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
