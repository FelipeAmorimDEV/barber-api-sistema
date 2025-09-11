import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  duration: z.number().int().min(15, 'Duração mínima é 15 minutos'),
  price: z.number().positive('Preço deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  barberId: z.string().uuid('ID do barbeiro inválido'),
  isActive: z.boolean().default(true),
})

export type CreateServiceDto = z.infer<typeof createServiceSchema>
