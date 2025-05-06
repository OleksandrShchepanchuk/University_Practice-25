import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { Roles } from 'src/modules/auth/decorators/roles.decorator'
import { User } from 'src/modules/auth/decorators/user.decorator'
import { FirebaseAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { RolesGuard } from 'src/modules/auth/guards/roles.guard'
import { CreateFavoritesDto } from '../dtos/create-favorites.dto'
import { Favorites } from '../models/favorites'
import { FavoritesService } from '../services/favorites.service'

@Controller('favorites')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @Roles('USER', 'ADMIN')
  async createFavorites(@Body() dto: CreateFavoritesDto, @User() user: any) {
    try {
      return await this.favoritesService.createFavorites(dto, user)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create favorites',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Get()
  @Roles('USER', 'ADMIN')
  async findAllFavorites(@User() user: any): Promise<Favorites[]> {
    try {
      return await this.favoritesService.findAllFavorites(user)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to get all favorites',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Delete(':id')
  @Roles('USER', 'ADMIN')
  async deleteFavorite(@Param('id') id: string, @User() user: any) {
    try {
      return await this.favoritesService.deleteFavorite(id, user)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete favorite',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
