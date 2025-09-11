import { AppError } from './app-error'

export class ReviewNotFoundError extends AppError {
  constructor() {
    super('Avaliação não encontrada', 404)
  }
}
