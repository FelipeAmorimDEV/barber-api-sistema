import { z } from 'zod'
import { UserRole } from '@/domain/barber/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.nativeEnum(UserRole).default(UserRole.CLIENT),
})

export type CreateUserDto = z.infer<typeof createUserSchema>

export class CreateUserDtoSwagger {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
  })
  name!: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
    format: 'email',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123456',
    minLength: 6,
  })
  password!: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.CLIENT,
    default: UserRole.CLIENT,
  })
  role!: UserRole;
}
