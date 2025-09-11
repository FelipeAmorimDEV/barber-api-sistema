import { AppError } from './app-error'

export class BarberNotAvailableError extends AppError {
  constructor() {
    super('Barbeiro não está disponível neste horário', 409)
  }
}
