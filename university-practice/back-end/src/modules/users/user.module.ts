import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UserService } from './services/users.service'

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [UserService],
})
export class UserModule {}
