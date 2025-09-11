import { z } from 'zod'
import { BookingStatus } from '@/domain/barber/entities/booking.entity'
import { ApiProperty } from '@nestjs/swagger'

export const createBookingSchema = z.object({
  clientId: z.string().uuid('ID do cliente inválido'),
  barberId: z.string().uuid('ID do barbeiro inválido'),
  serviceId: z.string().uuid('ID do serviço inválido'),
  date: z.string().datetime().transform((str) => new Date(str)),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)'),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).default('PENDING'),
  notes: z.string().optional(),
})

export type CreateBookingDto = z.infer<typeof createBookingSchema>

export class CreateBookingDtoSwagger {
  @ApiProperty({
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  clientId!: string

  @ApiProperty({
    description: 'ID do barbeiro',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  barberId!: string

  @ApiProperty({
    description: 'ID do serviço',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid',
  })
  serviceId!: string

  @ApiProperty({
    description: 'Data do agendamento',
    example: '2024-12-15T10:00:00Z',
    format: 'date-time',
  })
  date!: string

  @ApiProperty({
    description: 'Horário de início',
    example: '10:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  startTime!: string

  @ApiProperty({
    description: 'Horário de fim',
    example: '10:30',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  endTime!: string

  @ApiProperty({
    description: 'Status do agendamento',
    enum: BookingStatus,
    example: BookingStatus.PENDING,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus

  @ApiProperty({
    description: 'Observações do agendamento',
    example: 'Primeira vez na barbearia',
    required: false,
  })
  notes?: string
}
