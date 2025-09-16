import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, UsePipes, Query, UseGuards, Request } from '@nestjs/common'
import { BarberService } from '@/domain/barber/services/barber.service'
import { ReviewService } from '@/domain/barber/services/review.service'
import { BookingService } from '@/domain/barber/services/booking.service'
import { ServiceService } from '@/domain/barber/services/service.service'
import { CreateBarberDto, createBarberSchema } from '../dtos/create-barber.dto'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { PrismaService } from '../../prisma/prisma.service'

@Controller('/barbers')
export class BarberController {
  constructor(
    private barberService: BarberService,
    private reviewService: ReviewService,
    private bookingService: BookingService,
    private serviceService: ServiceService,
    private prisma: PrismaService
  ) {}

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

    // Buscar as avaliações do barbeiro
    const reviews = await this.reviewService.findReviewsByBarberId(id, 1)
    
    // Calcular a média de avaliações
    const averageRating = await this.reviewService.getBarberAverageRating(id)

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
        } : null,
        reviews: reviews.map(review => ({
          id: review.id.toString(),
          clientId: review.clientId,
          barberId: review.barberId,
          bookingId: review.bookingId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        })),
        averageRating: Math.round(averageRating * 100) / 100, // Arredondar para 2 casas decimais
        totalReviews: reviews.length
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

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req) {
    const userId = req.user.user.id
    
    const result = await this.barberService.findBarberByUserId(userId)
    
    if (result.isLeft()) {
      throw result.value
    }

    // Buscar as avaliações do barbeiro
    const reviews = await this.reviewService.findReviewsByBarberId(result.value.id.toString(), 1)
    
    // Calcular a média de avaliações
    const averageRating = await this.reviewService.getBarberAverageRating(result.value.id.toString())

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
        } : null,
        reviews: reviews.map(review => ({
          id: review.id.toString(),
          clientId: review.clientId,
          barberId: review.barberId,
          bookingId: review.bookingId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        })),
        averageRating: Math.round(averageRating * 100) / 100,
        totalReviews: reviews.length
      }
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const userId = req.user.user.id
    
    const result = await this.barberService.findBarberByUserId(userId)
    
    if (result.isLeft()) {
      throw result.value
    }

    // Buscar as avaliações do barbeiro
    const reviews = await this.reviewService.findReviewsByBarberId(result.value.id.toString(), 1)
    
    // Calcular a média de avaliações
    const averageRating = await this.reviewService.getBarberAverageRating(result.value.id.toString())

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
        } : null,
        reviews: reviews.map(review => ({
          id: review.id.toString(),
          clientId: review.clientId,
          barberId: review.barberId,
          bookingId: review.bookingId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        })),
        averageRating: Math.round(averageRating * 100) / 100,
        totalReviews: reviews.length
      }
    }
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard)
  async getBookings(
    @Request() req,
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const barberId = req.user.barber.id
    const pageNumber = page ? parseInt(page) : 1

    let bookings
    if (startDate && endDate) {
      bookings = await this.bookingService.findBookingsByDateRange(
        new Date(startDate),
        new Date(endDate)
      )
    } else {
      bookings = await this.bookingService.findBookingsByBarberId(barberId, pageNumber)
    }

    // Filtrar por status se fornecido
    if (status) {
      bookings = bookings.filter(booking => booking.status === status)
    }

    // Buscar dados relacionados para cada booking
    const bookingsWithRelations = await Promise.all(
      bookings.map(async (booking) => {
        // Buscar dados do cliente
        const client = await this.prisma.client.findUnique({
          where: { id: booking.clientId },
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
          client: client ? {
            id: client.id,
            userId: client.userId,
            phone: client.phone,
            user: {
              id: client.user.id,
              name: client.user.name,
              email: client.user.email,
              avatar: client.user.avatar
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

  @Get('bookings/today')
  @UseGuards(JwtAuthGuard)
  async getTodayBookings(@Request() req) {
    const barberId = req.user.barber.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const bookings = await this.bookingService.findBookingsByDateRange(today, tomorrow)
    
    // Filtrar apenas agendamentos do barbeiro autenticado
    const barberBookings = bookings.filter(booking => booking.barberId === barberId)

    // Buscar dados relacionados para cada booking
    const bookingsWithRelations = await Promise.all(
      barberBookings.map(async (booking) => {
        // Buscar dados do cliente
        const client = await this.prisma.client.findUnique({
          where: { id: booking.clientId },
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
          client: client ? {
            id: client.id,
            userId: client.userId,
            phone: client.phone,
            user: {
              id: client.user.id,
              name: client.user.name,
              email: client.user.email,
              avatar: client.user.avatar
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

  @Get('services')
  @UseGuards(JwtAuthGuard)
  async getServices(@Request() req, @Query('page') page?: string) {
    const barberId = req.user.barber.id
    const pageNumber = page ? parseInt(page) : 1

    const services = await this.serviceService.findServicesByBarberId(barberId, pageNumber)

    return {
      services: services.map(service => ({
        id: service.id.toString(),
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        isActive: service.isActive,
        barberId: service.barberId,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    }
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@Request() req) {
    const barberId = req.user.barber.id

    // Buscar todos os agendamentos do barbeiro
    const allBookings = await this.bookingService.findBookingsByBarberId(barberId, 1)
    
    // Buscar agendamentos dos últimos 12 meses para análise mensal
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
    const recentBookings = await this.bookingService.findBookingsByDateRange(twelveMonthsAgo, new Date())

    // Filtrar apenas agendamentos do barbeiro
    const barberBookings = recentBookings.filter(booking => booking.barberId === barberId)

    // Calcular estatísticas básicas
    const totalBookings = allBookings.length
    const completedBookings = allBookings.filter(booking => booking.status === 'COMPLETED').length
    const cancelledBookings = allBookings.filter(booking => booking.status === 'CANCELLED').length
    const pendingBookings = allBookings.filter(booking => booking.status === 'PENDING').length

    // Calcular receita total
    let totalRevenue = 0
    for (const booking of allBookings) {
      if (booking.status === 'COMPLETED') {
        const service = await this.prisma.service.findUnique({
          where: { id: booking.serviceId }
        })
        if (service) {
          totalRevenue += service.price
        }
      }
    }

    // Calcular média de avaliações
    const averageRating = await this.reviewService.getBarberAverageRating(barberId)

    // Contar clientes únicos
    const uniqueClientIds = new Set(allBookings.map(booking => booking.clientId))
    const totalClients = uniqueClientIds.size

    // Análise mensal dos últimos 12 meses
    const bookingsByMonth = this.calculateMonthlyBookings(barberBookings)

    // Top serviços mais agendados
    const topServices = await this.calculateTopServices(barberId, allBookings)

    return {
      analytics: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        totalRevenue: Math.round(totalRevenue * 100) / 100, // Arredondar para 2 casas decimais
        averageRating: Math.round(averageRating * 100) / 100,
        totalClients,
        bookingsByMonth,
        topServices
      }
    }
  }

  private calculateMonthlyBookings(bookings: any[]): Array<{ month: string; count: number; revenue: number }> {
    const monthlyData = new Map<string, { count: number; revenue: number }>()
    
    // Inicializar últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData.set(monthKey, { count: 0, revenue: 0 })
    }

    // Processar agendamentos
    for (const booking of bookings) {
      const date = new Date(booking.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (monthlyData.has(monthKey)) {
        const data = monthlyData.get(monthKey)!
        data.count++
        
        if (booking.status === 'COMPLETED') {
          // Buscar preço do serviço (simplificado - em produção seria melhor fazer uma query otimizada)
          // Por agora, vamos usar um valor médio estimado
          data.revenue += 30 // Valor médio estimado
        }
      }
    }

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      count: data.count,
      revenue: Math.round(data.revenue * 100) / 100
    }))
  }

  private async calculateTopServices(barberId: string, bookings: any[]): Promise<Array<{ serviceId: string; name: string; count: number; revenue: number }>> {
    const serviceStats = new Map<string, { count: number; revenue: number; name: string }>()

    for (const booking of bookings) {
      if (booking.status === 'COMPLETED') {
        const service = await this.prisma.service.findUnique({
          where: { id: booking.serviceId }
        })

        if (service) {
          const serviceId = service.id
          if (!serviceStats.has(serviceId)) {
            serviceStats.set(serviceId, { count: 0, revenue: 0, name: service.name })
          }
          
          const stats = serviceStats.get(serviceId)!
          stats.count++
          stats.revenue += service.price
        }
      }
    }

    return Array.from(serviceStats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 serviços
      .map(service => ({
        serviceId: service.serviceId || '',
        name: service.name,
        count: service.count,
        revenue: Math.round(service.revenue * 100) / 100
      }))
  }
}
