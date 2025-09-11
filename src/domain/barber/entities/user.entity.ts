import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export const UserRole = {
  CLIENT: 'CLIENT',
  BARBER: 'BARBER',
  ADMIN: 'ADMIN',
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

export interface UserProps {
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
  }

  set email(email: string) {
    this.props.email = email
  }

  set password(password: string) {
    this.props.password = password
  }

  set role(role: UserRole) {
    this.props.role = role
  }

  isClient() {
    return this.props.role === UserRole.CLIENT
  }

  isBarber() {
    return this.props.role === UserRole.BARBER
  }

  isAdmin() {
    return this.props.role === UserRole.ADMIN
  }

  static create(props: Omit<UserProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return user
  }
}
