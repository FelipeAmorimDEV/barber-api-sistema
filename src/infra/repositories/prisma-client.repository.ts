import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Client } from '@/domain/barber/entities/client.entity'
import { ClientRepository } from '@/domain/barber/repositories/client.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(private prisma: PrismaService) {}

  async create(client: Client): Promise<void> {
    await this.prisma.client.create({
      data: {
        id: client.id.toString(),
        userId: client.userId,
        phone: client.phone || undefined,
        birthDate: client.birthDate || undefined,
      },
    })
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    })

    if (!client) {
      return null
    }

    return Client.create(
      {
        userId: client.userId,
        phone: client.phone || undefined,
        birthDate: client.birthDate || undefined,
      },
      new UniqueEntityID(client.id),
    )
  }

  async findByUserId(userId: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { userId },
    })

    if (!client) {
      return null
    }

    return Client.create(
      {
        userId: client.userId,
        phone: client.phone || undefined,
        birthDate: client.birthDate || undefined,
      },
      new UniqueEntityID(client.id),
    )
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findFirst({
      where: {
        user: {
          email,
        },
      },
    })

    if (!client) {
      return null
    }

    return Client.create(
      {
        userId: client.userId,
        phone: client.phone || undefined,
        birthDate: client.birthDate || undefined,
      },
      new UniqueEntityID(client.id),
    )
  }

  async findMany(params: { page: number }): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return clients.map(client =>
      Client.create(
        {
          userId: client.userId,
          phone: client.phone,
          birthDate: client.birthDate,
        },
        new UniqueEntityID(client.id),
      ),
    )
  }

  async save(client: Client): Promise<void> {
    await this.prisma.client.update({
      where: { id: client.id.toString() },
      data: {
        phone: client.phone || undefined,
        birthDate: client.birthDate || undefined,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id },
    })
  }
}
