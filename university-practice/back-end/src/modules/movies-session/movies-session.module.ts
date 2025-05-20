import { Module } from '@nestjs/common'
import { FirestoreModule } from '../../providers'
import { AuthModule } from '../auth/auth.module'
import { BaseModule } from '../base/base.module'
import { MoviesSessionController } from './controllers/movies-session.controller'
import { MoviesSessionService } from './services/movies-session.service'

@Module({
  imports: [AuthModule, FirestoreModule, BaseModule],
  providers: [MoviesSessionService],
  controllers: [MoviesSessionController],
})
export class MoviesSessionModule {}
