import { Client } from '../entities/client.entity'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface ClientRepository {
  create(client: Client): Promise<void>
  findById(id: string): Promise<Client | null>
  findByUserId(userId: string): Promise<Client | null>
  findByEmail(email: string): Promise<Client | null>
  findMany(params: PaginationParams): Promise<Client[]>
  save(client: Client): Promise<void>
  delete(id: string): Promise<void>
}
