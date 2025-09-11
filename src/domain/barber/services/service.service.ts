import { Injectable, Inject } from '@nestjs/common'
import { Service } from '../entities/service.entity'
import { ServiceRepository } from '../repositories/service.repository'
import { Either, left, right } from '@/core/either'
import { ServiceNotFoundError } from '@/core/errors/service-not-found-error'

@Injectable()
export class ServiceService {
  constructor(
    @Inject('ServiceRepository')
    private serviceRepository: ServiceRepository
  ) {}

  async createService(data: {
    name: string
    description?: string
    duration: number
    price: number
    category: string
    barberId: string
    isActive: boolean
  }): Promise<Service> {
    const service = Service.create(data)
    await this.serviceRepository.create(service)
    return service
  }

  async findServiceById(id: string): Promise<Either<ServiceNotFoundError, Service>> {
    const service = await this.serviceRepository.findById(id)
    
    if (!service) {
      return left(new ServiceNotFoundError())
    }

    return right(service)
  }

  async findServicesByBarberId(barberId: string, page: number = 1): Promise<Service[]> {
    return this.serviceRepository.findByBarberId(barberId, { page })
  }

  async findActiveServices(page: number = 1, category?: string): Promise<Service[]> {
    return this.serviceRepository.findActiveServices({ page, category })
  }

  async updateService(id: string, data: Partial<{
    name: string
    description: string
    duration: number
    price: number
    category: string
    isActive: boolean
  }>): Promise<Either<ServiceNotFoundError, Service>> {
    const serviceResult = await this.findServiceById(id)
    
    if (serviceResult.isLeft()) {
      return serviceResult
    }

    const service = serviceResult.value

    if (data.name !== undefined) service.name = data.name
    if (data.description !== undefined) service.description = data.description
    if (data.duration !== undefined) service.duration = data.duration
    if (data.price !== undefined) service.price = data.price
    if (data.category !== undefined) service.category = data.category
    if (data.isActive !== undefined) service.isActive = data.isActive

    await this.serviceRepository.save(service)

    return right(service)
  }

  async deleteService(id: string): Promise<Either<ServiceNotFoundError, void>> {
    const serviceResult = await this.findServiceById(id)
    
    if (serviceResult.isLeft()) {
      return left(serviceResult.value)
    }

    await this.serviceRepository.delete(id)

    return right(undefined)
  }
}
