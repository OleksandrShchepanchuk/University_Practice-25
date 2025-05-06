import { Module } from '@nestjs/common'
import { FirestoreModule } from '../../providers/'
import { AuthModule } from '../auth/auth.module'
import { BaseModule } from '../base/base.module'
import { MovieController } from './controllers/movies.controller'
import { MovieService } from './services/movies.service'

@Module({
  imports: [AuthModule, FirestoreModule, BaseModule],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
