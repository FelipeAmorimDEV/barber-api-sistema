import { AppError } from './app-error'

export class ServiceNotFoundError extends AppError {
  constructor() {
    super('Serviço não encontrado', 404)
  }
}
