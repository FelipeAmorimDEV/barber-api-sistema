import { Injectable, Inject } from '@nestjs/common'
import { Review } from '../entities/review.entity'
import { ReviewRepository } from '../repositories/review.repository'
import { Either, left, right } from '@/core/either'
import { ReviewNotFoundError } from '@/core/errors/review-not-found-error'
import { BookingNotFoundError } from '@/core/errors/booking-not-found-error'
import { BookingService } from './booking.service'

@Injectable()
export class ReviewService {
  constructor(
    @Inject('ReviewRepository')
    private reviewRepository: ReviewRepository,
    private bookingService: BookingService
  ) {}

  async createReview(data: {
    clientId: string
    barberId: string
    bookingId: string
    rating: number
    comment?: string
  }): Promise<Either<BookingNotFoundError, Review>> {
    // Verificar se o agendamento existe e foi completado
    const bookingResult = await this.bookingService.findBookingById(data.bookingId)
    
    if (bookingResult.isLeft()) {
      return left(bookingResult.value)
    }

    const booking = bookingResult.value

    // Verificar se o agendamento foi completado
    if (!booking.isCompleted()) {
      return left(new BookingNotFoundError())
    }

    // Verificar se já existe uma avaliação para este agendamento
    const existingReview = await this.reviewRepository.findByBookingId(data.bookingId)
    if (existingReview) {
      return left(new BookingNotFoundError()) // Já existe avaliação
    }

    const review = Review.create(data)
    await this.reviewRepository.create(review)

    return right(review)
  }

  async findReviewById(id: string): Promise<Either<ReviewNotFoundError, Review>> {
    const review = await this.reviewRepository.findById(id)
    
    if (!review) {
      return left(new ReviewNotFoundError())
    }

    return right(review)
  }

  async findReviewsByBarberId(barberId: string, page: number = 1): Promise<Review[]> {
    return this.reviewRepository.findByBarberId(barberId, page)
  }

  async findReviewsByClientId(clientId: string, page: number = 1): Promise<Review[]> {
    return this.reviewRepository.findByClientId(clientId, page)
  }

  async updateReview(id: string, data: Partial<{
    rating: number
    comment: string
  }>): Promise<Either<ReviewNotFoundError, Review>> {
    const reviewResult = await this.findReviewById(id)
    
    if (reviewResult.isLeft()) {
      return reviewResult
    }

    const review = reviewResult.value

    if (data.rating !== undefined) review.rating = data.rating
    if (data.comment !== undefined) review.comment = data.comment

    await this.reviewRepository.save(review)

    return right(review)
  }

  async deleteReview(id: string): Promise<Either<ReviewNotFoundError, void>> {
    const reviewResult = await this.findReviewById(id)
    
    if (reviewResult.isLeft()) {
      return left(reviewResult.value)
    }

    await this.reviewRepository.delete(id)

    return right(undefined)
  }

  async getBarberAverageRating(barberId: string): Promise<number> {
    const reviews = await this.reviewRepository.findByBarberId(barberId, { page: 1 })
    
    if (reviews.length === 0) {
      return 0
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    return totalRating / reviews.length
  }
}
