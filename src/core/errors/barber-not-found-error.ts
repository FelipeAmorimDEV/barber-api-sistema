import { AppError } from './app-error'

export class BarberNotFoundError extends AppError {
  constructor() {
    super('Barbeiro não encontrado', 404)
  }
}
