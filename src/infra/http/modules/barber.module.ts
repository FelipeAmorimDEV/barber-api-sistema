import { Module } from '@nestjs/common'
import { UserController } from '../controllers/user.controller'
import { ClientController } from '../controllers/client.controller'
import { BarberController } from '../controllers/barber.controller'
import { ServiceController } from '../controllers/service.controller'
import { BookingController } from '../controllers/booking.controller'
import { ReviewController } from '../controllers/review.controller'
import { UserService } from '@/domain/barber/services/user.service'
import { ClientService } from '@/domain/barber/services/client.service'
import { BarberService } from '@/domain/barber/services/barber.service'
import { ServiceService } from '@/domain/barber/services/service.service'
import { BookingService } from '@/domain/barber/services/booking.service'
import { ReviewService } from '@/domain/barber/services/review.service'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { PrismaUserRepository } from '@/infra/repositories/prisma-user.repository'
import { PrismaClientRepository } from '@/infra/repositories/prisma-client.repository'
import { PrismaBarberRepository } from '@/infra/repositories/prisma-barber.repository'
import { PrismaServiceRepository } from '@/infra/repositories/prisma-service.repository'
import { PrismaBookingRepository } from '@/infra/repositories/prisma-booking.repository'
import { PrismaReviewRepository } from '@/infra/repositories/prisma-review.repository'

@Module({
  controllers: [
    UserController,
    ClientController,
    BarberController,
    ServiceController,
    BookingController,
    ReviewController,
  ],
  providers: [
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ClientRepository',
      useClass: PrismaClientRepository,
    },
    {
      provide: 'BarberRepository',
      useClass: PrismaBarberRepository,
    },
    {
      provide: 'ServiceRepository',
      useClass: PrismaServiceRepository,
    },
    {
      provide: 'BookingRepository',
      useClass: PrismaBookingRepository,
    },
    {
      provide: 'ReviewRepository',
      useClass: PrismaReviewRepository,
    },
    UserService,
    ClientService,
    BarberService,
    ServiceService,
    BookingService,
    ReviewService,
  ],
  exports: [
    UserService,
    ClientService,
    BarberService,
    ServiceService,
    BookingService,
    ReviewService,
  ],
})
export class BarberModule {}
