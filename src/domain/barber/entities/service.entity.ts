import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ServiceProps {
  name: string
  description?: string | null
  duration: number // Duração em minutos
  price: number
  category: string // Categoria do serviço
  isActive: boolean
  barberId: string
  createdAt: Date
  updatedAt: Date
}

export class Service extends Entity<ServiceProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description || undefined
  }

  get duration() {
    return this.props.duration
  }

  get price() {
    return this.props.price
  }

  get category() {
    return this.props.category
  }

  get isActive() {
    return this.props.isActive
  }

  get barberId() {
    return this.props.barberId
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

  set description(description: string | undefined) {
    this.props.description = description
  }

  set duration(duration: number) {
    this.props.duration = duration
  }

  set price(price: number) {
    this.props.price = price
  }

  set category(category: string) {
    this.props.category = category
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive
  }

  set barberId(barberId: string) {
    this.props.barberId = barberId
  }

  static create(props: Omit<ServiceProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
    const service = new Service(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return service
  }
}
