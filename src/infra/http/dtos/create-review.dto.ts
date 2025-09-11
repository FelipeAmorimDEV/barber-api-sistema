import { z } from 'zod'

export const createReviewSchema = z.object({
  clientId: z.string().uuid('ID do cliente inválido'),
  barberId: z.string().uuid('ID do barbeiro inválido'),
  bookingId: z.string().uuid('ID do agendamento inválido'),
  rating: z.number().int().min(1, 'Rating mínimo é 1').max(5, 'Rating máximo é 5'),
  comment: z.string().optional(),
})

export type CreateReviewDto = z.infer<typeof createReviewSchema>
