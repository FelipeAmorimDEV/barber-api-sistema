import { Controller, Post, Body, UseGuards, Get, Request, UsePipes } from '@nestjs/common';
import { AuthService } from '../../../domain/auth/services/auth.service';
import { LoginDto, loginSchema } from '../dtos/login.dto';
import { RegisterDto, registerSchema } from '../dtos/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
