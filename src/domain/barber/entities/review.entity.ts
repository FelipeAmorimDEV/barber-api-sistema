import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ReviewProps {
  clientId: string
  barberId: string
  bookingId: string
  rating: number // 1-5 estrelas
  comment?: string | null
  createdAt: Date
  updatedAt: Date
}

export class Review extends Entity<ReviewProps> {
  get clientId() {
    return this.props.clientId
  }

  get barberId() {
    return this.props.barberId
  }

  get bookingId() {
    return this.props.bookingId
  }

  get rating() {
    return this.props.rating
  }

  get comment() {
    return this.props.comment || undefined
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set rating(rating: number) {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating deve estar entre 1 e 5')
    }
    this.props.rating = rating
  }

  set comment(comment: string | undefined) {
    this.props.comment = comment
  }

  static create(props: Omit<ReviewProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
    if (props.rating < 1 || props.rating > 5) {
      throw new Error('Rating deve estar entre 1 e 5')
    }

    const review = new Review(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return review
  }
}
