import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User, UserRole } from '@/domain/barber/entities/user.entity'
import { UserRepository } from '@/domain/barber/repositories/user.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    })
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return null
    }

    return User.create(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role as UserRole,
      },
      new UniqueEntityID(user.id),
    )
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return User.create(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role as UserRole,
      },
      new UniqueEntityID(user.id),
    )
  }

  async findMany(params: { page: number }): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return users.map(user =>
      User.create(
        {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role as UserRole,
        },
        new UniqueEntityID(user.id),
      ),
    )
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id.toString() },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
