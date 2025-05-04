import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { BaseService } from './services/base.service'

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [BaseService],
  exports: [BaseService],
})
export class BaseModule {}
