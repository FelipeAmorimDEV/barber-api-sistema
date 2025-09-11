import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Service } from '@/domain/barber/entities/service.entity'
import { ServiceRepository } from '@/domain/barber/repositories/service.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private prisma: PrismaService) {}

  async create(service: Service): Promise<void> {
    await this.prisma.service.create({
      data: {
        id: service.id.toString(),
        name: service.name,
        description: service.description || undefined,
        duration: service.duration,
        price: service.price,
        category: service.category,
        barberId: service.barberId,
        isActive: service.isActive,
      },
    })
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      return null
    }

    return Service.create(
      {
        name: service.name,
        description: service.description || undefined,
        duration: service.duration,
        price: Number(service.price),
        category: service.category,
        barberId: service.barberId,
        isActive: service.isActive,
      },
      new UniqueEntityID(service.id),
    )
  }

  async findByBarberId(barberId: string, params: { page: number }): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: { barberId },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return services.map(service =>
      Service.create(
        {
          name: service.name,
          description: service.description || undefined,
          duration: service.duration,
          price: Number(service.price),
          category: service.category,
          barberId: service.barberId,
          isActive: service.isActive,
        },
        new UniqueEntityID(service.id),
      ),
    )
  }

  async findActiveServices(params: { page: number; category?: string }): Promise<Service[]> {
    const whereClause: any = { isActive: true }
    
    if (params.category) {
      whereClause.category = params.category
    }

    const services = await this.prisma.service.findMany({
      where: whereClause,
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return services.map(service =>
      Service.create(
        {
          name: service.name,
          description: service.description || undefined,
          duration: service.duration,
          price: Number(service.price),
          category: service.category,
          barberId: service.barberId,
          isActive: service.isActive,
        },
        new UniqueEntityID(service.id),
      ),
    )
  }

  async findMany(params: { page: number }): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return services.map(service =>
      Service.create(
        {
          name: service.name,
          description: service.description || undefined,
          duration: service.duration,
          price: Number(service.price),
          category: service.category,
          barberId: service.barberId,
          isActive: service.isActive,
        },
        new UniqueEntityID(service.id),
      ),
    )
  }

  async save(service: Service): Promise<void> {
    await this.prisma.service.update({
      where: { id: service.id.toString() },
      data: {
        name: service.name,
        description: service.description || undefined,
        duration: service.duration,
        price: service.price,
        category: service.category,
        isActive: service.isActive,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    })
  }
}
