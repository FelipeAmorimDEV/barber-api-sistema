import { Injectable, Inject } from '@nestjs/common'
import { Barber } from '../entities/barber.entity'
import { BarberRepository } from '../repositories/barber.repository'
import { Either, left, right } from '@/core/either'
import { BarberNotFoundError } from '@/core/errors/barber-not-found-error'

@Injectable()
export class BarberService {
  constructor(
    @Inject('BarberRepository')
    private barberRepository: BarberRepository
  ) {}

  async createBarber(data: {
    userId: string
    phone?: string
    specialties: string
    isActive: boolean
  }): Promise<Barber> {
    const barber = Barber.create(data)
    await this.barberRepository.create(barber)
    return barber
  }

  async findBarberById(id: string): Promise<Either<BarberNotFoundError, Barber>> {
    const barber = await this.barberRepository.findById(id)
    
    if (!barber) {
      return left(new BarberNotFoundError())
    }

    return right(barber)
  }

  async findBarberByUserId(userId: string): Promise<Either<BarberNotFoundError, Barber>> {
    const barber = await this.barberRepository.findByUserId(userId)
    
    if (!barber) {
      return left(new BarberNotFoundError())
    }

    return right(barber)
  }

  async findActiveBarbers(page: number = 1): Promise<Barber[]> {
    return this.barberRepository.findActiveBarbers({ page })
  }

  async findBarbersBySpecialty(specialty: string, page: number = 1): Promise<Barber[]> {
    return this.barberRepository.findBySpecialty(specialty, { page })
  }

  async updateBarber(id: string, data: Partial<{
    phone: string
    specialties: string
    isActive: boolean
  }>): Promise<Either<BarberNotFoundError, Barber>> {
    const barberResult = await this.findBarberById(id)
    
    if (barberResult.isLeft()) {
      return barberResult
    }

    const barber = barberResult.value

    if (data.phone !== undefined) barber.phone = data.phone
    if (data.specialties !== undefined) barber.specialties = data.specialties
    if (data.isActive !== undefined) barber.isActive = data.isActive

    await this.barberRepository.save(barber)

    return right(barber)
  }

  async addSpecialty(id: string, specialty: string): Promise<Either<BarberNotFoundError, Barber>> {
    const barberResult = await this.findBarberById(id)
    
    if (barberResult.isLeft()) {
      return barberResult
    }

    const barber = barberResult.value
    barber.addSpecialty(specialty)

    await this.barberRepository.save(barber)

    return right(barber)
  }

  async removeSpecialty(id: string, specialty: string): Promise<Either<BarberNotFoundError, Barber>> {
    const barberResult = await this.findBarberById(id)
    
    if (barberResult.isLeft()) {
      return barberResult
    }

    const barber = barberResult.value
    barber.removeSpecialty(specialty)

    await this.barberRepository.save(barber)

    return right(barber)
  }

  async deleteBarber(id: string): Promise<Either<BarberNotFoundError, void>> {
    const barberResult = await this.findBarberById(id)
    
    if (barberResult.isLeft()) {
      return left(barberResult.value)
    }

    await this.barberRepository.delete(id)

    return right(undefined)
  }
}
