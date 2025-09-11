import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, UsePipes, Query } from '@nestjs/common'
import { ReviewService } from '@/domain/barber/services/review.service'
import { CreateReviewDto, createReviewSchema } from '../dtos/create-review.dto'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

@Controller('/reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createReviewSchema))
  async create(@Body() body: CreateReviewDto) {
    const result = await this.reviewService.createReview(body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      review: {
        id: result.value.id.toString(),
        clientId: result.value.clientId,
        barberId: result.value.barberId,
        bookingId: result.value.bookingId,
        rating: result.value.rating,
        comment: result.value.comment,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Get()
  async findMany(
    @Query('page') page?: string,
    @Query('barberId') barberId?: string,
    @Query('clientId') clientId?: string
  ) {
    const pageNumber = page ? parseInt(page) : 1

    let reviews
    if (barberId) {
      reviews = await this.reviewService.findReviewsByBarberId(barberId, pageNumber)
    } else if (clientId) {
      reviews = await this.reviewService.findReviewsByClientId(clientId, pageNumber)
    } else {
      reviews = []
    }

    return {
      reviews: reviews.map(review => ({
        id: review.id.toString(),
        clientId: review.clientId,
        barberId: review.barberId,
        bookingId: review.bookingId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      }))
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.reviewService.findReviewById(id)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      review: {
        id: result.value.id.toString(),
        clientId: result.value.clientId,
        barberId: result.value.barberId,
        bookingId: result.value.bookingId,
        rating: result.value.rating,
        comment: result.value.comment,
        createdAt: result.value.createdAt,
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{
      rating: number
      comment: string
    }>
  ) {
    const result = await this.reviewService.updateReview(id, body)
    
    if (result.isLeft()) {
      throw result.value
    }

    return {
      review: {
        id: result.value.id.toString(),
        clientId: result.value.clientId,
        barberId: result.value.barberId,
        bookingId: result.value.bookingId,
        rating: result.value.rating,
        comment: result.value.comment,
        updatedAt: result.value.updatedAt,
      }
    }
  }

  @Get('barber/:barberId/average-rating')
  async getBarberAverageRating(@Param('barberId') barberId: string) {
    const averageRating = await this.reviewService.getBarberAverageRating(barberId)

    return {
      barberId,
      averageRating: Math.round(averageRating * 100) / 100, // Arredondar para 2 casas decimais
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const result = await this.reviewService.deleteReview(id)
    
    if (result.isLeft()) {
      throw result.value
    }
  }
}
