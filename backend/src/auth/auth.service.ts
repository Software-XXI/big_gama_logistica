import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/common/providers/repositories/user.repository';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email ya registrado');
    }

    const user = await this.userRepo.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      role: dto.role,
      isActive: true,
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async getProfile(userId: string) {
    return this.userRepo.findById(userId);
  }
}