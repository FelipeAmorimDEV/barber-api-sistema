import { z } from 'zod';

export const AvailableSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)'),
  isAvailable: z.boolean(),
});

export type AvailableSlotDto = z.infer<typeof AvailableSlotSchema>;

export const AvailableSlotsResponseSchema = z.object({
  barberId: z.string(),
  serviceId: z.string(),
  date: z.string(),
  serviceDuration: z.number(),
  availableSlots: z.array(AvailableSlotSchema),
});

export type AvailableSlotsResponseDto = z.infer<typeof AvailableSlotsResponseSchema>;
