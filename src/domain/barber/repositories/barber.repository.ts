import { Barber } from '../entities/barber.entity'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface BarberRepository {
  create(barber: Barber): Promise<void>
  findById(id: string): Promise<Barber | null>
  findByUserId(userId: string): Promise<Barber | null>
  findActiveBarbers(params: PaginationParams): Promise<Barber[]>
  findBySpecialty(specialty: string, params: PaginationParams): Promise<Barber[]>
  findMany(params: PaginationParams): Promise<Barber[]>
  save(barber: Barber): Promise<void>
  delete(id: string): Promise<void>
}
