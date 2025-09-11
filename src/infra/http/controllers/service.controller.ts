import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, UsePipes, Query } from '@nestjs/common'
import { ServiceService } from '@/domain/barber/services/service.service'
import { CreateServiceDto, createServiceSchema } from '../dtos/create-service.dto'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

@Controller('/services')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createServiceSchema))
  async create(@Body() body: CreateServiceDto) {
    const service = await this.serviceService.createService(body)

    return {
      service: {
        id: service.id.toString(),
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        barberId: service.barberId,
        isActive: service.isActive,
        createdAt: service.createdAt,
      }
    }
  }

  @Get()
  async findMany(
    @Query('page') page?: string, 
    @Query('barberId') barberId?: string,
    @Query('category') category?: string
  ) {
    const pageNumber = page ? parseInt(page) : 1

    let services
    if (barberId) {
      services = await this.serviceService.findServicesByBarberId(barberId, pageNumber)
    } else {
      services = await this.serviceService.findActiveServices(pageNumber, category)
    }

    return {
      services: services.map(service => ({
        id: service.id.toString(),
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        barberId: service.barberId,
        isActive: service.isActive,
        createdAt: service.createdAt,
      }))
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.serviceService.findServiceById(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      service: {
        id: result.value.id.toString(),
        name: result.value.name,
        description: result.value.description,
        duration: result.value.duration,
        price: result.value.price,
        category: result.value.category,
        barberId: result.value.barberId,
        isActive: result.value.isActive,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{
      name: string
      description: string
      duration: number
      price: number
      category: string
      isActive: boolean
    }>
  ) {
    const result = await this.serviceService.updateService(id, body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      service: {
        id: result.value.id.toString(),
        name: result.value.name,
        description: result.value.description,
        duration: result.value.duration,
        price: result.value.price,
        category: result.value.category,
        barberId: result.value.barberId,
        isActive: result.value.isActive,
        updatedAt: result.value.updatedAt,
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const result = await this.serviceService.deleteService(id)
    
    if (result.isLeft()) {
      throw result.value
    }
  }
}
