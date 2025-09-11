import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface BarberProps {
  userId: string
  phone?: string | null
  specialties: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export class Barber extends Entity<BarberProps> {
  get userId() {
    return this.props.userId
  }

  get phone() {
    return this.props.phone || undefined
  }

  get specialties() {
    return this.props.specialties
  }

  get isActive() {
    return this.props.isActive
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get user() {
    return this.props.user
  }

  set phone(phone: string | undefined) {
    this.props.phone = phone
  }

  set specialties(specialties: string) {
    this.props.specialties = specialties
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive
  }

  addSpecialty(specialty: string) {
    const specialties = this.props.specialties.split(',').map(s => s.trim()).filter(s => s)
    if (!specialties.includes(specialty)) {
      specialties.push(specialty)
      this.props.specialties = specialties.join(', ')
    }
  }

  removeSpecialty(specialty: string) {
    const specialties = this.props.specialties.split(',').map(s => s.trim()).filter(s => s && s !== specialty)
    this.props.specialties = specialties.join(', ')
  }

  static create(props: Omit<BarberProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
    const barber = new Barber(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return barber
  }
}
