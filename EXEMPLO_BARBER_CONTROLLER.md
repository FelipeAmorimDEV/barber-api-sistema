# 📝 Exemplo Prático: Documentando Barber Controller

## Como o BarberController deve ficar após a documentação Swagger:

```typescript
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, UsePipes, Query } from '@nestjs/common'
import { BarberService } from '@/domain/barber/services/barber.service'
import { ReviewService } from '@/domain/barber/services/review.service'
import { CreateBarberDto, createBarberSchema } from '../dtos/create-barber.dto'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger'

@ApiTags('barbeiros')
@Controller('/barbers')
export class BarberController {
  constructor(
    private barberService: BarberService,
    private reviewService: ReviewService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createBarberSchema))
  @ApiOperation({ 
    summary: 'Criar novo barbeiro',
    description: 'Cadastra um novo barbeiro no sistema com suas especialidades'
  })
  @ApiBody({ type: CreateBarberDtoSwagger })
  @ApiResponse({ 
    status: 201, 
    description: 'Barbeiro criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        barber: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '478808ec-e82a-4002-817d-4843b4183786' },
            userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            phone: { type: 'string', example: '11999999999' },
            specialties: { type: 'string', example: 'Corte, Barba, Sobrancelha' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2024-12-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Usuário já é barbeiro' })
  async create(@Body() body: CreateBarberDto) {
    const barber = await this.barberService.createBarber(body)

    return {
      barber: {
        id: barber.id.toString(),
        userId: barber.userId,
        phone: barber.phone,
        specialties: barber.specialties,
        isActive: barber.isActive,
        createdAt: barber.createdAt,
      }
    }
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar barbeiros',
    description: 'Lista barbeiros ativos com paginação e filtro por especialidade'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Número da página para paginação', 
    example: 1,
    type: Number
  })
  @ApiQuery({ 
    name: 'specialty', 
    required: false, 
    description: 'Filtrar por especialidade específica', 
    example: 'Corte'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de barbeiros encontrados',
    schema: {
      type: 'object',
      properties: {
        barbers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '478808ec-e82a-4002-817d-4843b4183786' },
              userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              phone: { type: 'string', example: '11999999999' },
              specialties: { type: 'string', example: 'Corte, Barba' },
              isActive: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', example: 'joao@barber.com' },
                  avatar: { type: 'string', example: 'https://example.com/avatar.jpg' }
                }
              }
            }
          }
        }
      }
    }
  })
  async findMany(@Query('page') page?: string, @Query('specialty') specialty?: string) {
    const pageNumber = page ? parseInt(page) : 1

    let barbers
    if (specialty) {
      barbers = await this.barberService.findBarbersBySpecialty(specialty, pageNumber)
    } else {
      barbers = await this.barberService.findActiveBarbers(pageNumber)
    }

    return {
      barbers: barbers.map(barber => ({
        id: barber.id.toString(),
        userId: barber.userId,
        phone: barber.phone,
        specialties: barber.specialties,
        isActive: barber.isActive,
        createdAt: barber.createdAt,
        user: barber.user ? {
          id: barber.user.id,
          name: barber.user.name,
          email: barber.user.email,
          avatar: barber.user.avatar
        } : null
      }))
    }
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar barbeiro por ID',
    description: 'Retorna dados completos do barbeiro incluindo avaliações e média de rating'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único do barbeiro', 
    example: '478808ec-e82a-4002-817d-4843b4183786',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Barbeiro encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        barber: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '478808ec-e82a-4002-817d-4843b4183786' },
            userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            phone: { type: 'string', example: '11999999999' },
            specialties: { type: 'string', example: 'Corte, Barba' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                name: { type: 'string', example: 'João Silva' },
                email: { type: 'string', example: 'joao@barber.com' },
                avatar: { type: 'string', example: 'https://example.com/avatar.jpg' }
              }
            },
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'review-uuid' },
                  clientId: { type: 'string', example: 'client-uuid' },
                  barberId: { type: 'string', example: 'barber-uuid' },
                  bookingId: { type: 'string', example: 'booking-uuid' },
                  rating: { type: 'number', example: 5, minimum: 1, maximum: 5 },
                  comment: { type: 'string', example: 'Excelente atendimento!' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            averageRating: { type: 'number', example: 4.8, description: 'Média das avaliações' },
            totalReviews: { type: 'number', example: 15, description: 'Total de avaliações' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  async findById(@Param('id') id: string) {
    const result = await this.barberService.findBarberById(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    // Buscar as avaliações do barbeiro
    const reviews = await this.reviewService.findReviewsByBarberId(id, 1)
    
    // Calcular a média de avaliações
    const averageRating = await this.reviewService.getBarberAverageRating(id)

    return {
      barber: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        specialties: result.value.specialties,
        isActive: result.value.isActive,
        createdAt: result.value.createdAt,
        user: result.value.user ? {
          id: result.value.user.id,
          name: result.value.user.name,
          email: result.value.user.email,
          avatar: result.value.user.avatar
        } : null,
        reviews: reviews.map(review => ({
          id: review.id.toString(),
          clientId: review.clientId,
          barberId: review.barberId,
          bookingId: review.bookingId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        })),
        averageRating: Math.round(averageRating * 100) / 100,
        totalReviews: reviews.length
      }
    }
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Buscar barbeiro por ID do usuário',
    description: 'Retorna dados do barbeiro baseado no ID do usuário associado'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'ID do usuário associado ao barbeiro', 
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Barbeiro encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        barber: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '478808ec-e82a-4002-817d-4843b4183786' },
            userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            phone: { type: 'string', example: '11999999999' },
            specialties: { type: 'string', example: 'Corte, Barba' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                name: { type: 'string', example: 'João Silva' },
                email: { type: 'string', example: 'joao@barber.com' },
                avatar: { type: 'string', example: 'https://example.com/avatar.jpg' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  async findByUserId(@Param('userId') userId: string) {
    const result = await this.barberService.findBarberByUserId(userId)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        specialties: result.value.specialties,
        isActive: result.value.isActive,
        createdAt: result.value.createdAt,
        user: result.value.user ? {
          id: result.value.user.id,
          name: result.value.user.name,
          email: result.value.user.email,
          avatar: result.value.user.avatar
        } : null
      }
    }
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar barbeiro',
    description: 'Atualiza dados do barbeiro (telefone, especialidades, status ativo)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único do barbeiro', 
    example: '478808ec-e82a-4002-817d-4843b4183786',
    type: String
  })
  @ApiBody({ 
    description: 'Dados para atualização',
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '11988888888', description: 'Novo telefone' },
        specialties: { type: 'string', example: 'Corte, Barba, Sobrancelha', description: 'Especialidades atualizadas' },
        isActive: { type: 'boolean', example: true, description: 'Status ativo do barbeiro' }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Barbeiro atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        barber: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '478808ec-e82a-4002-817d-4843b4183786' },
            userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            phone: { type: 'string', example: '11988888888' },
            specialties: { type: 'string', example: 'Corte, Barba, Sobrancelha' },
            isActive: { type: 'boolean', example: true },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{
      phone: string
      specialties: string
      isActive: boolean
    }>
  ) {
    const result = await this.barberService.updateBarber(id, body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        userId: result.value.userId,
        phone: result.value.phone,
        specialties: result.value.specialties,
        isActive: result.value.isActive,
        updatedAt: result.value.updatedAt,
      }
    }
  }

  @Post(':id/specialties')
  @ApiOperation({ 
    summary: 'Adicionar especialidade',
    description: 'Adiciona uma nova especialidade ao barbeiro'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único do barbeiro', 
    example: '478808ec-e82a-4002-817d-4843b4183786',
    type: String
  })
  @ApiBody({ 
    description: 'Especialidade a ser adicionada',
    schema: {
      type: 'object',
      properties: {
        specialty: { type: 'string', example: 'Design de Barba', description: 'Nome da especialidade' }
      },
      required: ['specialty']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Especialidade adicionada com sucesso',
    schema: {
      type: 'object',
      properties: {
        barber: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '478808ec-e82a-4002-817d-4843b4183786' },
            specialties: { type: 'string', example: 'Corte, Barba, Design de Barba' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  @ApiResponse({ status: 400, description: 'Especialidade já existe' })
  async addSpecialty(@Param('id') id: string, @Body() body: { specialty: string }) {
    const result = await this.barberService.addSpecialty(id, body.specialty)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        specialties: result.value.specialties,
      }
    }
  }

  @Delete(':id/specialties')
  @ApiOperation({ 
    summary: 'Remover especialidade',
    description: 'Remove uma especialidade específica do barbeiro'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único do barbeiro', 
    example: '478808ec-e82a-4002-817d-4843b4183786',
    type: String
  })
  @ApiBody({ 
    description: 'Especialidade a ser removida',
    schema: {
      type: 'object',
      properties: {
        specialty: { type: 'string', example: 'Design de Barba', description: 'Nome da especialidade' }
      },
      required: ['specialty']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Especialidade removida com sucesso',
    schema: {
      type: 'object',
      properties: {
        barber: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '478808ec-e82a-4002-817d-4843b4183786' },
            specialties: { type: 'string', example: 'Corte, Barba' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  @ApiResponse({ status: 400, description: 'Especialidade não encontrada' })
  async removeSpecialty(@Param('id') id: string, @Body() body: { specialty: string }) {
    const result = await this.barberService.removeSpecialty(id, body.specialty)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      barber: {
        id: result.value.id.toString(),
        specialties: result.value.specialties,
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Deletar barbeiro',
    description: 'Remove um barbeiro do sistema permanentemente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único do barbeiro', 
    example: '478808ec-e82a-4002-817d-4843b4183786',
    type: String
  })
  @ApiResponse({ status: 204, description: 'Barbeiro deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  async delete(@Param('id') id: string) {
    const result = await this.barberService.deleteBarber(id)
    
    if (result.isLeft()) {
      throw result.value
    }
  }
}
```

## DTO Swagger para CreateBarberDto:

```typescript
// create-barber.dto.ts
import { ApiProperty } from '@nestjs/swagger'

export class CreateBarberDtoSwagger {
  @ApiProperty({
    description: 'ID do usuário que será barbeiro',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  userId!: string

  @ApiProperty({
    description: 'Telefone de contato do barbeiro',
    example: '11999999999',
    pattern: '^[0-9]{10,11}$'
  })
  phone!: string

  @ApiProperty({
    description: 'Especialidades do barbeiro separadas por vírgula',
    example: 'Corte, Barba, Sobrancelha',
    minLength: 2
  })
  specialties!: string

  @ApiProperty({
    description: 'Status ativo do barbeiro',
    example: true,
    default: true
  })
  isActive!: boolean
}
```

## Como implementar:

1. **Adicione os imports do Swagger** no topo do arquivo
2. **Adicione `@ApiTags('barbeiros')`** na classe
3. **Adicione `@ApiOperation`** em cada método
4. **Adicione `@ApiResponse`** para cada status HTTP
5. **Adicione `@ApiParam`** para parâmetros de rota
6. **Adicione `@ApiQuery`** para query parameters
7. **Adacione `@ApiBody`** para corpo da requisição
8. **Crie o DTO Swagger** separado

## Resultado:

Após implementar, o Swagger UI mostrará:
- ✅ Documentação completa de todos os endpoints
- ✅ Exemplos de request/response
- ✅ Validações e tipos de dados
- ✅ Códigos de status HTTP
- ✅ Interface interativa para testar
