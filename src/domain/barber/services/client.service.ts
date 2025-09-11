import { Injectable, Inject } from '@nestjs/common'
import { Client } from '../entities/client.entity'
import { ClientRepository } from '../repositories/client.repository'
import { Either, left, right } from '@/core/either'
import { ClientNotFoundError } from '@/core/errors/client-not-found-error'

@Injectable()
export class ClientService {
  constructor(
    @Inject('ClientRepository')
    private clientRepository: ClientRepository
  ) {}

  async createClient(data: {
    userId: string
    phone?: string
    birthDate?: Date
  }): Promise<Client> {
    const client = Client.create(data)
    await this.clientRepository.create(client)
    return client
  }

  async findClientById(id: string): Promise<Either<ClientNotFoundError, Client>> {
    const client = await this.clientRepository.findById(id)
    
    if (!client) {
      return left(new ClientNotFoundError())
    }

    return right(client)
  }

  async findClientByUserId(userId: string): Promise<Either<ClientNotFoundError, Client>> {
    const client = await this.clientRepository.findByUserId(userId)
    
    if (!client) {
      return left(new ClientNotFoundError())
    }

    return right(client)
  }

  async updateClient(id: string, data: Partial<{
    phone: string
    birthDate: Date
  }>): Promise<Either<ClientNotFoundError, Client>> {
    const clientResult = await this.findClientById(id)
    
    if (clientResult.isLeft()) {
      return clientResult
    }

    const client = clientResult.value

    if (data.phone !== undefined) client.phone = data.phone
    if (data.birthDate !== undefined) client.birthDate = data.birthDate

    await this.clientRepository.save(client)

    return right(client)
  }

  async deleteClient(id: string): Promise<Either<ClientNotFoundError, void>> {
    const clientResult = await this.findClientById(id)
    
    if (clientResult.isLeft()) {
      return left(clientResult.value)
    }

    await this.clientRepository.delete(id)

    return right(undefined)
  }
}
