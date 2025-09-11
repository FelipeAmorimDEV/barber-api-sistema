import { z } from 'zod'

export const createClientSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
  phone: z.string().optional(),
  birthDate: z.string().datetime().optional().transform((str) => str ? new Date(str) : undefined),
})

export type CreateClientDto = z.infer<typeof createClientSchema>
