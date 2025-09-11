import { AppError } from './app-error'

export class ClientNotFoundError extends AppError {
  constructor() {
    super('Cliente não encontrado', 404)
  }
}
