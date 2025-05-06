import { Body, Controller, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Roles } from 'src/modules/auth/decorators/roles.decorator'
import { FirebaseAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { RolesGuard } from 'src/modules/auth/guards/roles.guard'
import { BaseController } from 'src/modules/base/controllers/base.controller'
import { CreateMoviesSessionDto } from '../dtos/create-session.dto'
import { UpdateMoviesSessionDto } from '../dtos/update-session.dto'
import { MoviesSession } from '../models/movies-session'
import { MoviesSessionService } from '../services/movies-session.service'

@Controller('movies-session')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class MoviesSessionController extends BaseController<MoviesSession> {
  constructor(private readonly movieSessionService: MoviesSessionService) {
    super(movieSessionService)
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: CreateMoviesSessionDto) {
    try {
      return this.service.create(data)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create movie',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() data: UpdateMoviesSessionDto) {
    try {
      return this.service.update(id, data as Partial<MoviesSession>)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update movie',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
