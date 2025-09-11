import { AppError } from './app-error'

export class BookingNotFoundError extends AppError {
  constructor() {
    super('Agendamento não encontrado', 404)
  }
}
