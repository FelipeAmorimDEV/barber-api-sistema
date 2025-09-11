import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const GetAvailableSlotsSchema = z.object({
  barberId: z.string().uuid('ID do barbeiro deve ser um UUID válido'),
  serviceId: z.string().uuid('ID do serviço deve ser um UUID válido'),
  date: z.string().datetime('Data deve estar no formato ISO 8601'),
});

export type GetAvailableSlotsDto = z.infer<typeof GetAvailableSlotsSchema>;

export class GetAvailableSlotsDtoSwagger {
  @ApiProperty({
    description: 'ID do barbeiro',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  barberId!: string;

  @ApiProperty({
    description: 'ID do serviço',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid',
  })
  serviceId!: string;

  @ApiProperty({
    description: 'Data para verificar disponibilidade',
    example: '2024-12-15T00:00:00Z',
    format: 'date-time',
  })
  date!: string;
}
