import { AppError } from './app-error'

export class InvalidTimeSlotError extends AppError {
  constructor() {
    super('Horário inválido para agendamento', 400)
  }
}
