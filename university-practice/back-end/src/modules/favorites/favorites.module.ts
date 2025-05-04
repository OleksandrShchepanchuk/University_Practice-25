import { Module } from '@nestjs/common'
import { FirestoreModule } from '../../providers'
import { AuthModule } from '../auth/auth.module'
import { BaseModule } from '../base/base.module'
import { FavoritesController } from './controllers/favorites.controller'
import { FavoritesService } from './services/favorites.service'

@Module({
  imports: [AuthModule, FirestoreModule, BaseModule],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
