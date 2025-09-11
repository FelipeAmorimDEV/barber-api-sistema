import { Booking, BookingStatus } from '../entities/booking.entity'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface BookingRepository {
  create(booking: Booking): Promise<void>
  findById(id: string): Promise<Booking | null>
  findByClientId(clientId: string, params: PaginationParams): Promise<Booking[]>
  findByBarberId(barberId: string, params: PaginationParams): Promise<Booking[]>
  findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>
  findByBarberAndDate(barberId: string, date: Date): Promise<Booking[]>
  findByStatus(status: BookingStatus, params: PaginationParams): Promise<Booking[]>
  findMany(params: PaginationParams): Promise<Booking[]>
  save(booking: Booking): Promise<void>
  delete(id: string): Promise<void>
}
