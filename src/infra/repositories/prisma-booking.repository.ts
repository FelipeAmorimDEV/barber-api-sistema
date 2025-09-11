import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Booking, BookingStatus } from '@/domain/barber/entities/booking.entity'
import { BookingRepository } from '@/domain/barber/repositories/booking.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private prisma: PrismaService) {}

  async create(booking: Booking): Promise<void> {
    await this.prisma.booking.create({
      data: {
        id: booking.id.toString(),
        clientId: booking.clientId,
        barberId: booking.barberId,
        serviceId: booking.serviceId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        notes: booking.notes || undefined,
      },
    })
  }

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    })

    if (!booking) {
      return null
    }

    return Booking.create(
      {
        clientId: booking.clientId,
        barberId: booking.barberId,
        serviceId: booking.serviceId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status as BookingStatus,
        notes: booking.notes || undefined,
      },
      new UniqueEntityID(booking.id),
    )
  }

  async findByClientId(clientId: string, params: { page: number }): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { clientId },
      skip: (params.page - 1) * 20,
      take: 20,
      include: {
        barber: {
          include: {
            user: true
          }
        },
        service: true
      }
    })

    return bookings.map(booking =>
      Booking.create(
        {
          clientId: booking.clientId,
          barberId: booking.barberId,
          serviceId: booking.serviceId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status as BookingStatus,
          notes: booking.notes || undefined,
        },
        new UniqueEntityID(booking.id),
      ),
    )
  }

  async findByBarberId(barberId: string, params: { page: number }): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { barberId },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return bookings.map(booking =>
      Booking.create(
        {
          clientId: booking.clientId,
          barberId: booking.barberId,
          serviceId: booking.serviceId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status as BookingStatus,
          notes: booking.notes || undefined,
        },
        new UniqueEntityID(booking.id),
      ),
    )
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    })

    return bookings.map(booking =>
      Booking.create(
        {
          clientId: booking.clientId,
          barberId: booking.barberId,
          serviceId: booking.serviceId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status as BookingStatus,
          notes: booking.notes || undefined,
        },
        new UniqueEntityID(booking.id),
      ),
    )
  }

  async findByBarberAndDate(barberId: string, date: Date): Promise<Booking[]> {
    // Usar a data diretamente para comparação
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const bookings = await this.prisma.booking.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      orderBy: { startTime: 'asc' },
    })

    return bookings.map(booking =>
      Booking.create(
        {
          clientId: booking.clientId,
          barberId: booking.barberId,
          serviceId: booking.serviceId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status as BookingStatus,
          notes: booking.notes || undefined,
        },
        new UniqueEntityID(booking.id),
      ),
    )
  }

  async findByStatus(status: BookingStatus, params: { page: number }): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { status },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return bookings.map(booking =>
      Booking.create(
        {
          clientId: booking.clientId,
          barberId: booking.barberId,
          serviceId: booking.serviceId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status as BookingStatus,
          notes: booking.notes || undefined,
        },
        new UniqueEntityID(booking.id),
      ),
    )
  }

  async findMany(params: { page: number }): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return bookings.map(booking =>
      Booking.create(
        {
          clientId: booking.clientId,
          barberId: booking.barberId,
          serviceId: booking.serviceId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status as BookingStatus,
          notes: booking.notes || undefined,
        },
        new UniqueEntityID(booking.id),
      ),
    )
  }

  async save(booking: Booking): Promise<void> {
    await this.prisma.booking.update({
      where: { id: booking.id.toString() },
      data: {
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        notes: booking.notes || undefined,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({
      where: { id },
    })
  }
}
