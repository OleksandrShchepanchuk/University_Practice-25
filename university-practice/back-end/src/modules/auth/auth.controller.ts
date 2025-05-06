import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common'
import { UserDto } from '../users/dtos/user.dto'
import { UserService } from '../users/services/users.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(@Body() userRequest: UserDto) {
    try {
      return await this.userService.create(userRequest)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create user',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
