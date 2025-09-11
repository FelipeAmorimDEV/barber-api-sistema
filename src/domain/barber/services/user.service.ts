import { Injectable, Inject } from '@nestjs/common'
import { User, UserRole } from '../entities/user.entity'
import { UserRepository } from '../repositories/user.repository'
import { Either, left, right, Right } from '@/core/either'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists-error'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository
  ) {}

  async createUser(data: {
    name: string
    email: string
    password: string
    role: UserRole
  }): Promise<Either<EmailAlreadyExistsError, User>> {
    const existingUser = await this.userRepository.findByEmail(data.email)
    
    if (existingUser) {
      return left(new EmailAlreadyExistsError())
    }

    const hashedPassword = await bcrypt.hash(data.password, 8)
    
    const user = User.create({
      ...data,
      password: hashedPassword,
    })

    await this.userRepository.create(user)

    return right(user)
  }

  async findUserById(id: string): Promise<Either<UserNotFoundError, User>> {
    const user = await this.userRepository.findById(id)
    
    if (!user) {
      return left(new UserNotFoundError())
    }

    return right(user)
  }

  async findUserByEmail(email: string): Promise<Either<UserNotFoundError, User>> {
    const user = await this.userRepository.findByEmail(email)
    
    if (!user) {
      return left(new UserNotFoundError())
    }

    return right(user)
  }

  async updateUser(id: string, data: Partial<{
    name: string
    email: string
    password: string
    role: UserRole
  }>): Promise<Either<UserNotFoundError, User>> {
    const userResult = await this.findUserById(id)
    
    if (userResult.isLeft()) {
      return userResult
    }

    const user = (userResult as Right<UserNotFoundError, User>).value

    if (data.name) user.name = data.name
    if (data.email) user.email = data.email
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 8)
    }
    if (data.role) user.role = data.role

    await this.userRepository.save(user)

    return right(user)
  }

  async deleteUser(id: string): Promise<Either<UserNotFoundError, void>> {
    const userResult = await this.findUserById(id)
    
    if (userResult.isLeft()) {
      return left(userResult.value)
    }

    await this.userRepository.delete(id)

    return right(undefined)
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}
