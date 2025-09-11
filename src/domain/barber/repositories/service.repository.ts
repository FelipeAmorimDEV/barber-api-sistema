import { Service } from '../entities/service.entity'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface ServiceRepository {
  create(service: Service): Promise<void>
  findById(id: string): Promise<Service | null>
  findByBarberId(barberId: string, params: PaginationParams): Promise<Service[]>
  findActiveServices(params: PaginationParams & { category?: string }): Promise<Service[]>
  findMany(params: PaginationParams): Promise<Service[]>
  save(service: Service): Promise<void>
  delete(id: string): Promise<void>
}
