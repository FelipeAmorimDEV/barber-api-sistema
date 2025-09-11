import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, UsePipes } from '@nestjs/common'
import { UserService } from '@/domain/barber/services/user.service'
import { CreateUserDto, createUserSchema, CreateUserDtoSwagger } from '../dtos/create-user.dto'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UserRole } from '@/domain/barber/entities/user.entity'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'

@ApiTags('usuarios')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiBody({ type: CreateUserDtoSwagger })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async create(@Body() body: CreateUserDto) {
    const result = await this.userService.createUser(body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      user: {
        id: result.value.id.toString(),
        name: result.value.name,
        email: result.value.email,
        role: result.value.role,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findById(@Param('id') id: string) {
    const result = await this.userService.findUserById(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      user: {
        id: result.value.id.toString(),
        name: result.value.name,
        email: result.value.email,
        role: result.value.role,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Buscar usuário por email' })
  @ApiParam({ name: 'email', description: 'Email do usuário', example: 'joao@email.com' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findByEmail(@Param('email') email: string) {
    const result = await this.userService.findUserByEmail(email)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      user: {
        id: result.value.id.toString(),
        name: result.value.name,
        email: result.value.email,
        role: result.value.role,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{
      name: string
      email: string
      password: string
      role: UserRole
    }>
  ) {
    const result = await this.userService.updateUser(id, body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      user: {
        id: result.value.id.toString(),
        name: result.value.name,
        email: result.value.email,
        role: result.value.role,
        updatedAt: result.value.updatedAt,
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 'uuid' })
  @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async delete(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id)
    
    if (result.isLeft()) {
      throw result.value
    }
  }
}
