import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Review } from '@/domain/barber/entities/review.entity'
import { ReviewRepository } from '@/domain/barber/repositories/review.repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
  constructor(private prisma: PrismaService) {}

  async create(review: Review): Promise<void> {
    await this.prisma.review.create({
      data: {
        id: review.id.toString(),
        clientId: review.clientId,
        barberId: review.barberId,
        bookingId: review.bookingId,
        rating: review.rating,
        comment: review.comment || undefined,
      },
    })
  }

  async findById(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      return null
    }

    return Review.create(
      {
        clientId: review.clientId,
        barberId: review.barberId,
        bookingId: review.bookingId,
        rating: review.rating,
        comment: review.comment || undefined,
      },
      new UniqueEntityID(review.id),
    )
  }

  async findByBookingId(bookingId: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: { bookingId },
    })

    if (!review) {
      return null
    }

    return Review.create(
      {
        clientId: review.clientId,
        barberId: review.barberId,
        bookingId: review.bookingId,
        rating: review.rating,
        comment: review.comment || undefined,
      },
      new UniqueEntityID(review.id),
    )
  }

  async findByBarberId(barberId: string, params: { page: number }): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { barberId },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return reviews.map(review =>
      Review.create(
        {
          clientId: review.clientId,
          barberId: review.barberId,
          bookingId: review.bookingId,
          rating: review.rating,
          comment: review.comment || undefined,
        },
        new UniqueEntityID(review.id),
      ),
    )
  }

  async findByClientId(clientId: string, params: { page: number }): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { clientId },
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return reviews.map(review =>
      Review.create(
        {
          clientId: review.clientId,
          barberId: review.barberId,
          bookingId: review.bookingId,
          rating: review.rating,
          comment: review.comment || undefined,
        },
        new UniqueEntityID(review.id),
      ),
    )
  }

  async findMany(params: { page: number }): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      skip: (params.page - 1) * 20,
      take: 20,
    })

    return reviews.map(review =>
      Review.create(
        {
          clientId: review.clientId,
          barberId: review.barberId,
          bookingId: review.bookingId,
          rating: review.rating,
          comment: review.comment || undefined,
        },
        new UniqueEntityID(review.id),
      ),
    )
  }

  async save(review: Review): Promise<void> {
    await this.prisma.review.update({
      where: { id: review.id.toString() },
      data: {
        rating: review.rating,
        comment: review.comment || undefined,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.review.delete({
      where: { id },
    })
  }
}
