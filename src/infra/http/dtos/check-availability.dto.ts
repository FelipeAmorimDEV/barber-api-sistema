import { z } from 'zod'

export const checkAvailabilitySchema = z.object({
  barberId: z.string().uuid('ID do barbeiro inválido'),
  date: z.string().datetime().transform((str) => new Date(str)),
  serviceId: z.string().uuid('ID do serviço inválido').optional(),
})

export type CheckAvailabilityDto = z.infer<typeof checkAvailabilitySchema>
