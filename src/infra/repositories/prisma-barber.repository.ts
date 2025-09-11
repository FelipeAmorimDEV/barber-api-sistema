import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Barber } from '@/domain/barber/entities/barber.entity'
import { BarberRepository } from '@/domain/barber/repositories/barber.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaBarberRepository implements BarberRepository {
  constructor(private prisma: PrismaService) {}

  async create(barber: Barber): Promise<void> {
    await this.prisma.barber.create({
      data: {
        id: barber.id.toString(),
        userId: barber.userId,
        phone: barber.phone || undefined,
        specialties: barber.specialties,
        isActive: barber.isActive,
      },
    })
  }

  async findById(id: string): Promise<Barber | null> {
    const barber = await this.prisma.barber.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    if (!barber) {
      return null
    }

    return Barber.create(
      {
        userId: barber.userId,
        phone: barber.phone || undefined,
        specialties: barber.specialties,
        isActive: barber.isActive,
        user: barber.user ? {
          id: barber.user.id,
          name: barber.user.name,
          email: barber.user.email,
          avatar: barber.user.avatar || undefined
        } : undefined
      },
      new UniqueEntityID(barber.id),
    )
  }

  async findByUserId(userId: string): Promise<Barber | null> {
    const barber = await this.prisma.barber.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    if (!barber) {
      return null
    }

    return Barber.create(
      {
        userId: barber.userId,
        phone: barber.phone || undefined,
        specialties: barber.specialties,
        isActive: barber.isActive,
        user: barber.user ? {
          id: barber.user.id,
          name: barber.user.name,
          email: barber.user.email,
          avatar: barber.user.avatar || undefined
        } : undefined
      },
      new UniqueEntityID(barber.id),
    )
  }

  async findActiveBarbers(params: { page: number }): Promise<Barber[]> {
    const barbers = await this.prisma.barber.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return barbers.map(barber =>
      Barber.create(
        {
          userId: barber.userId,
          phone: barber.phone || undefined,
          specialties: barber.specialties,
          isActive: barber.isActive,
          user: barber.user ? {
          id: barber.user.id,
          name: barber.user.name,
          email: barber.user.email,
          avatar: barber.user.avatar || undefined
        } : undefined
        },
        new UniqueEntityID(barber.id),
      ),
    )
  }

  async findBySpecialty(specialty: string, params: { page: number }): Promise<Barber[]> {
    const barbers = await this.prisma.barber.findMany({
      where: {
        isActive: true,
        specialties: {
          contains: specialty,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return barbers.map(barber =>
      Barber.create(
        {
          userId: barber.userId,
          phone: barber.phone || undefined,
          specialties: barber.specialties,
          isActive: barber.isActive,
          user: barber.user ? {
          id: barber.user.id,
          name: barber.user.name,
          email: barber.user.email,
          avatar: barber.user.avatar || undefined
        } : undefined
        },
        new UniqueEntityID(barber.id),
      ),
    )
  }

  async findMany(params: { page: number }): Promise<Barber[]> {
    const barbers = await this.prisma.barber.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return barbers.map(barber =>
      Barber.create(
        {
          userId: barber.userId,
          phone: barber.phone || undefined,
          specialties: barber.specialties,
          isActive: barber.isActive,
          user: barber.user ? {
          id: barber.user.id,
          name: barber.user.name,
          email: barber.user.email,
          avatar: barber.user.avatar || undefined
        } : undefined
        },
        new UniqueEntityID(barber.id),
      ),
    )
  }

  async save(barber: Barber): Promise<void> {
    await this.prisma.barber.update({
      where: { id: barber.id.toString() },
      data: {
        phone: barber.phone || undefined,
        specialties: barber.specialties,
        isActive: barber.isActive,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.barber.delete({
      where: { id },
    })
  }
}
