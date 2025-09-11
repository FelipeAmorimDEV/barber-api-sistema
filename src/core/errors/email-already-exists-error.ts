import { AppError } from './app-error'

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super('Email já está em uso', 409)
  }
}
