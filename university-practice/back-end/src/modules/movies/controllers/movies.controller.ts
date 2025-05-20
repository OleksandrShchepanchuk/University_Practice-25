import { Body, Controller, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Roles } from 'src/modules/auth/decorators/roles.decorator'
import { FirebaseAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { RolesGuard } from 'src/modules/auth/guards/roles.guard'
import { BaseController } from 'src/modules/base/controllers/base.controller'
import { CreateMovieDto } from '../dtos/create-movie.dto'
import { UpdateMovieDto } from '../dtos/update-movie.dto'
import { Movie } from '../models/movie'
import { MovieService } from '../services/movies.service'

@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller('movies')
export class MovieController extends BaseController<Movie> {
  constructor(private readonly movieService: MovieService) {
    super(movieService)
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: CreateMovieDto) {
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
  async update(@Param('id') id: string, @Body() data: UpdateMovieDto) {
    try {
      return this.service.update(id, data)
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
