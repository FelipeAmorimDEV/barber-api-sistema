import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, UsePipes } from '@nestjs/common'
import { ClientService } from '@/domain/barber/services/client.service'
import { CreateClientDto, createClientSchema } from '../dtos/create-client.dto'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

@Controller('/clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createClientSchema))
  async create(@Body() body: CreateClientDto) {
    const client = await this.clientService.createClient(body)

    return {
      client: {
        id: client.id.toString(),
        userId: client.userId,
        phone: client.phone,
        birthDate: client.birthDate,
        createdAt: client.createdAt,
      }
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.clientService.findClientById(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      client: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        birthDate: result.value.birthDate,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    const result = await this.clientService.findClientByUserId(userId)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      client: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        birthDate: result.value.birthDate,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{
      phone: string
      birthDate: Date
    }>
  ) {
    const result = await this.clientService.updateClient(id, body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      client: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        birthDate: result.value.birthDate,
        updatedAt: result.value.updatedAt,
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const result = await this.clientService.deleteClient(id)
    
    if (result.isLeft()) {
      throw result.value
    }
  }
}
