import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus]

export interface BookingProps {
  clientId: string
  barberId: string
  serviceId: string
  date: Date
  startTime: string // Formato HH:MM
  endTime: string // Formato HH:MM
  status: BookingStatus
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export class Booking extends Entity<BookingProps> {
  get clientId() {
    return this.props.clientId
  }

  get barberId() {
    return this.props.barberId
  }

  get serviceId() {
    return this.props.serviceId
  }

  get date() {
    return this.props.date
  }

  get startTime() {
    return this.props.startTime
  }

  get endTime() {
    return this.props.endTime
  }

  get status() {
    return this.props.status
  }

  get notes() {
    return this.props.notes || undefined
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set date(date: Date) {
    this.props.date = date
  }

  set startTime(startTime: string) {
    this.props.startTime = startTime
  }

  set endTime(endTime: string) {
    this.props.endTime = endTime
  }

  set status(status: BookingStatus) {
    this.props.status = status
  }

  set notes(notes: string | undefined) {
    this.props.notes = notes
  }

  confirm() {
    this.props.status = BookingStatus.CONFIRMED
  }

  cancel() {
    this.props.status = BookingStatus.CANCELLED
  }

  complete() {
    this.props.status = BookingStatus.COMPLETED
  }

  isPending() {
    return this.props.status === BookingStatus.PENDING
  }

  isConfirmed() {
    return this.props.status === BookingStatus.CONFIRMED
  }

  isCancelled() {
    return this.props.status === BookingStatus.CANCELLED
  }

  isCompleted() {
    return this.props.status === BookingStatus.COMPLETED
  }

  static create(props: Omit<BookingProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
    const booking = new Booking(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return booking
  }
}
