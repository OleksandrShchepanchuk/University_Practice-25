import { Controller } from '@nestjs/common'
import { UserService } from '../services/users.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
