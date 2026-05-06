import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { IUserRepository, CreateUserDto } from '@/common/interfaces/repositories/i-user.repository';
import { User, UserRole, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User & { password: string } | null> {
    return this.prisma.user.findUnique({ where: { email } }) as Promise<User & { password: string } | null>;
  }

  async findById(id: string): Promise<{ id: string; email: string; name: string; role: string; isActive: boolean } | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  }

  async findAllByRole(role: UserRole): Promise<{ id: string; email: string; name: string; role: string }[]> {
    return this.prisma.user.findMany({
      where: { role, isActive: true },
      select: { id: true, email: true, name: true, role: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateUserDto): Promise<User & { password: string }> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: dto.role,
        isActive: dto.isActive ?? true,
      },
    }) as Promise<User & { password: string }>;
  }
}