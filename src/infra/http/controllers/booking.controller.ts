import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, UsePipes, Query, UseGuards, Request } from '@nestjs/common'
import { BookingService } from '@/domain/barber/services/booking.service'
import { CreateBookingDto, createBookingSchema, CreateBookingDtoSwagger } from '../dtos/create-booking.dto'
import { CreateBookingAuthDto, createBookingAuthSchema, CreateBookingAuthDtoSwagger } from '../dtos/create-booking-auth.dto'
import { UpdateBookingDto, updateBookingSchema } from '../dtos/update-booking.dto'
import { CheckAvailabilityDto, checkAvailabilitySchema } from '../dtos/check-availability.dto'
import { GetAvailableSlotsDto, GetAvailableSlotsSchema, GetAvailableSlotsDtoSwagger } from '../dtos/get-available-slots.dto'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { PrismaService } from '../../prisma/prisma.service'

@ApiTags('agendamentos')
@Controller('/bookings')
export class BookingController {
  constructor(
    private bookingService: BookingService,
    private prisma: PrismaService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createBookingAuthSchema))
  @ApiOperation({ summary: 'Criar novo agendamento' })
  @ApiBody({ type: CreateBookingAuthDtoSwagger })
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Barbeiro não disponível no horário' })
  async create(@Request() req, @Body() body: CreateBookingAuthDto) {
    // Usar o clientId do usuário autenticado
    const clientId = req.user.client.id
    const bookingData = { ...body, clientId }
    
    const result = await this.bookingService.createBooking(bookingData)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      booking: {
        id: result.value.id.toString(),
        clientId: result.value.clientId,
        barberId: result.value.barberId,
        serviceId: result.value.serviceId,
        date: result.value.date,
        startTime: result.value.startTime,
        endTime: result.value.endTime,
        status: result.value.status,
        notes: result.value.notes,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar agendamentos do usuário autenticado' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página', example: 1 })
  @ApiQuery({ name: 'status', required: false, description: 'Status do agendamento', example: 'PENDING' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial', example: '2024-12-01' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final', example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos' })
  async findMany(
    @Request() req,
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const pageNumber = page ? parseInt(page) : 1
    const clientId = req.user.client.id

    let bookings
    if (startDate && endDate) {
      bookings = await this.bookingService.findBookingsByDateRange(
        new Date(startDate),
        new Date(endDate)
      )
    } else {
      bookings = await this.bookingService.findBookingsByClientId(clientId, pageNumber)
    }

    // Filtrar por status se fornecido
    if (status) {
      bookings = bookings.filter(booking => booking.status === status)
    }

    // Buscar dados relacionados para cada booking
    const bookingsWithRelations = await Promise.all(
      bookings.map(async (booking) => {
        // Buscar dados do barbeiro
        const barber = await this.prisma.barber.findUnique({
          where: { id: booking.barberId },
          include: { user: true }
        })

        // Buscar dados do serviço
        const service = await this.prisma.service.findUnique({
          where: { id: booking.serviceId }
        })

        return {
          id: booking.id.toString(),
          clientId: booking.clientId,
          barberId: booking.barberId,
          serviceId: booking.serviceId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          notes: booking.notes,
          createdAt: booking.createdAt,
          barber: barber ? {
            id: barber.id,
            userId: barber.userId,
            phone: barber.phone,
            specialties: barber.specialties,
            isActive: barber.isActive,
            createdAt: barber.createdAt,
            user: {
              id: barber.user.id,
              name: barber.user.name,
              email: barber.user.email,
              avatar: barber.user.avatar
            }
          } : null,
          service: service ? {
            id: service.id,
            name: service.name,
            description: service.description,
            duration: service.duration,
            price: service.price,
            isActive: service.isActive,
            barberId: service.barberId,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt
          } : null,
        }
      })
    )

    return {
      bookings: bookingsWithRelations
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.bookingService.findBookingById(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      booking: {
        id: result.value.id.toString(),
        clientId: result.value.clientId,
        barberId: result.value.barberId,
        serviceId: result.value.serviceId,
        date: result.value.date,
        startTime: result.value.startTime,
        endTime: result.value.endTime,
        status: result.value.status,
        notes: result.value.notes,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateBookingSchema))
  async update(@Param('id') id: string, @Body() body: UpdateBookingDto) {
    const result = await this.bookingService.updateBooking(id, body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      booking: {
        id: result.value.id.toString(),
        clientId: result.value.clientId,
        barberId: result.value.barberId,
        serviceId: result.value.serviceId,
        date: result.value.date,
        startTime: result.value.startTime,
        endTime: result.value.endTime,
        status: result.value.status,
        notes: result.value.notes,
        updatedAt: result.value.updatedAt,
      }
    }
  }

  @Post(':id/confirm')
  async confirm(@Param('id') id: string) {
    const result = await this.bookingService.confirmBooking(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      booking: {
        id: result.value.id.toString(),
        status: result.value.status,
      }
    }
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    const result = await this.bookingService.cancelBooking(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      booking: {
        id: result.value.id.toString(),
        status: result.value.status,
      }
    }
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    const result = await this.bookingService.completeBooking(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      booking: {
        id: result.value.id.toString(),
        status: result.value.status,
      }
    }
  }

  @Post('check-availability')
  @UsePipes(new ZodValidationPipe(checkAvailabilitySchema))
  async checkAvailability(@Body() body: CheckAvailabilityDto) {
    const isAvailable = await this.bookingService.checkBarberAvailability(
      body.barberId,
      body.date,
      '09:00',
      '17:00'
    )

    return {
      available: isAvailable,
      barberId: body.barberId,
      date: body.date,
    }
  }

  @Post('available-slots')
  @UsePipes(new ZodValidationPipe(GetAvailableSlotsSchema))
  @ApiOperation({ 
    summary: 'Obter horários disponíveis do barbeiro',
    description: 'Retorna todos os horários disponíveis para um barbeiro em uma data específica, considerando a duração do serviço e agendamentos existentes'
  })
  @ApiBody({ type: GetAvailableSlotsDtoSwagger })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de horários disponíveis',
    schema: {
      type: 'object',
      properties: {
        barberId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
        serviceId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
        date: { type: 'string', example: '2024-12-15T00:00:00.000Z' },
        serviceDuration: { type: 'number', example: 30 },
        availableSlots: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              startTime: { type: 'string', example: '10:00' },
              endTime: { type: 'string', example: '10:30' },
              isAvailable: { type: 'boolean', example: true }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  async getAvailableSlots(@Body() body: GetAvailableSlotsDto) {
    const result = await this.bookingService.getAvailableSlots(
      body.barberId,
      body.serviceId,
      new Date(body.date)
    )
    
    if (result.isLeft()) {
      throw result.value
    }

    return result.value
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const result = await this.bookingService.deleteBooking(id)
    
    if (result.isLeft()) {
      throw result.value
    }
  }
}
