import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { LoginDto } from '../../../infra/http/dtos/login.dto';
import { RegisterDto } from '../../../infra/http/dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, phone } = registerDto;

    // Verificar se o usuário já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Criar cliente associado
    const client = await this.prisma.client.create({
      data: {
        userId: user.id,
        phone: phone || '',
      },
    });

    // Gerar JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      client: {
        id: client.id,
        userId: client.userId,
        phone: client.phone,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const response: any = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      token,
    };

    // Buscar perfil baseado no role do usuário
    if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findFirst({
        where: { userId: user.id },
      });

      if (!client) {
        throw new UnauthorizedException('Perfil de cliente não encontrado');
      }

      response.client = {
        id: client.id,
        userId: client.userId,
        phone: client.phone,
      };
    } else if (user.role === 'BARBER') {
      const barber = await this.prisma.barber.findFirst({
        where: { userId: user.id },
      });

      if (!barber) {
        throw new UnauthorizedException('Perfil de barbeiro não encontrado');
      }

      response.barber = {
        id: barber.id,
        userId: barber.userId,
        phone: barber.phone,
        specialties: barber.specialties,
        isActive: barber.isActive,
      };
    }

    return response;
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const response: any = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    };

    // Buscar perfil baseado no role do usuário
    if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findFirst({
        where: { userId: user.id },
      });

      if (!client) {
        throw new UnauthorizedException('Perfil de cliente não encontrado');
      }

      response.client = {
        id: client.id,
        userId: client.userId,
        phone: client.phone,
      };
    } else if (user.role === 'BARBER') {
      const barber = await this.prisma.barber.findFirst({
        where: { userId: user.id },
      });

      if (!barber) {
        throw new UnauthorizedException('Perfil de barbeiro não encontrado');
      }

      response.barber = {
        id: barber.id,
        userId: barber.userId,
        phone: barber.phone,
        specialties: barber.specialties,
        isActive: barber.isActive,
      };
    }

    return response;
  }
}
