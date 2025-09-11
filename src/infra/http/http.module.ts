import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { PrismaService } from "../prisma/prisma.service";
import { BarberModule } from "./modules/barber.module";
import { BookingModule } from "./modules/booking.module";
import { AuthModule } from "./modules/auth.module";

@Module({
  controllers: [CreateAccountController],
  providers: [PrismaService],
  imports: [BarberModule, BookingModule, AuthModule]
})
export class HttpModule {}