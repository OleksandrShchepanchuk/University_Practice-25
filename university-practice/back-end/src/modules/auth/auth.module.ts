import { Module } from '@nestjs/common'
import { FirebaseAdminModule } from 'src/providers/firebase-admin/firebase-admin.module'
import { UserService } from '../users/services/users.service'
import { AuthController } from './auth.controller'
import { FirebaseAuthGuard } from './guards/auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { FirebaseStrategy } from './strategy/firebase-strategy'

@Module({
  imports: [FirebaseAdminModule],
  controllers: [AuthController],
  providers: [FirebaseAuthGuard, RolesGuard, FirebaseStrategy, UserService],
  exports: [FirebaseAuthGuard, RolesGuard, FirebaseAdminModule],
})
export class AuthModule {}
