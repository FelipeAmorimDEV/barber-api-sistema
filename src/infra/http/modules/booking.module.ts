import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { BookingController } from '../controllers/booking.controller'
import { BookingService } from '@/domain/barber/services/booking.service'
import { PrismaBookingRepository } from '../../repositories/prisma-booking.repository'
import { PrismaServiceRepository } from '../../repositories/prisma-service.repository'
import { PrismaService } from '../../prisma/prisma.service'
import { AuthService } from '@/domain/auth/services/auth.service'
import { JwtStrategy } from '../strategies/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    PrismaService,
    AuthService,
    JwtStrategy,
    {
      provide: 'BookingRepository',
      useClass: PrismaBookingRepository,
    },
    {
      provide: 'ServiceRepository',
      useClass: PrismaServiceRepository,
    },
  ],
})
export class BookingModule {}

