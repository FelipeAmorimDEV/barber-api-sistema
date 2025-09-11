import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, UsePipes, Query } from '@nestjs/common'
import { BarberService } from '@/domain/barber/services/barber.service'
import { CreateBarberDto, createBarberSchema } from '../dtos/create-barber.dto'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

@Controller('/barbers')
export class BarberController {
  constructor(private barberService: BarberService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createBarberSchema))
  async create(@Body() body: CreateBarberDto) {
    const barber = await this.barberService.createBarber(body)

    return {
      barber: {
        id: barber.id.toString(),
        userId: barber.userId,
        phone: barber.phone,
        specialties: barber.specialties,
        isActive: barber.isActive,
        createdAt: barber.createdAt,
      }
    }
  }

  @Get()
  async findMany(@Query('page') page?: string, @Query('specialty') specialty?: string) {
    const pageNumber = page ? parseInt(page) : 1

    let barbers
    if (specialty) {
      barbers = await this.barberService.findBarbersBySpecialty(specialty, pageNumber)
    } else {
      barbers = await this.barberService.findActiveBarbers(pageNumber)
    }

    return {
      barbers: barbers.map(barber => ({
        id: barber.id.toString(),
        userId: barber.userId,
        phone: barber.phone,
        specialties: barber.specialties,
        isActive: barber.isActive,
        createdAt: barber.createdAt,
        user: barber.user ? {
          id: barber.user.id,
          name: barber.user.name,
          email: barber.user.email,
          avatar: barber.user.avatar
        } : null
      }))
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.barberService.findBarberById(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        specialties: result.value.specialties,
        isActive: result.value.isActive,
        createdAt: result.value.createdAt,
        user: result.value.user ? {
          id: result.value.user.id,
          name: result.value.user.name,
          email: result.value.user.email,
          avatar: result.value.user.avatar
        } : null
      }
    }
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    const result = await this.barberService.findBarberByUserId(userId)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        specialties: result.value.specialties,
        isActive: result.value.isActive,
        createdAt: result.value.createdAt,
        user: result.value.user ? {
          id: result.value.user.id,
          name: result.value.user.name,
          email: result.value.user.email,
          avatar: result.value.user.avatar
        } : null
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{
      phone: string
      specialties: string
      isActive: boolean
    }>
  ) {
    const result = await this.barberService.updateBarber(id, body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        specialties: result.value.specialties,
        isActive: result.value.isActive,
        updatedAt: result.value.updatedAt,
      }
    }
  }

  @Post(':id/specialties')
  async addSpecialty(@Param('id') id: string, @Body() body: { specialty: string }) {
    const result = await this.barberService.addSpecialty(id, body.specialty)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        specialties: result.value.specialties,
      }
    }
  }

  @Delete(':id/specialties')
  async removeSpecialty(@Param('id') id: string, @Body() body: { specialty: string }) {
    const result = await this.barberService.removeSpecialty(id, body.specialty)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        specialties: result.value.specialties,
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const result = await this.barberService.deleteBarber(id)
    
    if (result.isLeft()) {
      throw result.value
    }
  }
}
