import { z } from 'zod'
import { BookingStatus } from '@/domain/barber/entities/booking.entity'

export const updateBookingSchema = z.object({
  date: z.string().datetime().transform((str) => new Date(str)).optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)').optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)').optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().optional(),
})

export type UpdateBookingDto = z.infer<typeof updateBookingSchema>
