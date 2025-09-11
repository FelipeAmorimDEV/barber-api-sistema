import { z } from 'zod'

export const createBarberSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
  phone: z.string().optional(),
  specialties: z.string().default(''),
  isActive: z.boolean().default(true),
})

export type CreateBarberDto = z.infer<typeof createBarberSchema>
