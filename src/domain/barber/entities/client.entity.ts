import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClientProps {
  userId: string
  phone?: string | null
  birthDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

export class Client extends Entity<ClientProps> {
  get userId() {
    return this.props.userId
  }

  get phone() {
    return this.props.phone || undefined
  }

  get birthDate() {
    return this.props.birthDate || undefined
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set phone(phone: string | undefined) {
    this.props.phone = phone
  }

  set birthDate(birthDate: Date | undefined) {
    this.props.birthDate = birthDate
  }

  static create(props: Omit<ClientProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
    const client = new Client(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return client
  }
}
