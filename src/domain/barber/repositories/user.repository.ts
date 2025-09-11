import { User } from '../entities/user.entity'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface UserRepository {
  create(user: User): Promise<void>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findMany(params: PaginationParams): Promise<User[]>
  save(user: User): Promise<void>
  delete(id: string): Promise<void>
}
