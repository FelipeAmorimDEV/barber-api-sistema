import { Review } from '../entities/review.entity'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface ReviewRepository {
  create(review: Review): Promise<void>
  findById(id: string): Promise<Review | null>
  findByBookingId(bookingId: string): Promise<Review | null>
  findByBarberId(barberId: string, params: PaginationParams): Promise<Review[]>
  findByClientId(clientId: string, params: PaginationParams): Promise<Review[]>
  findMany(params: PaginationParams): Promise<Review[]>
  save(review: Review): Promise<void>
  delete(id: string): Promise<void>
}
