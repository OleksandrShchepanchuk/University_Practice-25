import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Roles } from 'src/modules/auth/decorators/roles.decorator'
import { FirebaseAuthGuard } from 'src/modules/auth/guards/auth.guard'
import { RolesGuard } from 'src/modules/auth/guards/roles.guard'
import { IBaseService } from '../models'

@Controller()
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class BaseController<T> {
  constructor(protected readonly service: IBaseService<T>) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: Partial<T>) {
    try {
      return this.service.create(data)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to get document',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Get()
  @Roles('USER', 'ADMIN')
  async findAll() {
    try {
      return this.service.findAll()
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to get all documents',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Get(':id')
  @Roles('USER', 'ADMIN')
  async findById(@Param('id') id: string) {
    try {
      return this.service.findById(id)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to get by id document',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() data: Partial<T>) {
    try {
      return this.service.update(id, data)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update document',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    try {
      return this.service.delete(id)
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete document',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
