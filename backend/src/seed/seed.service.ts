import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const adminExists = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!adminExists) {
      console.log('🔧 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.prisma.user.create({
        data: {
          email: 'admin@biggamma.com',
          password: hashedPassword,
          name: 'Administrador',
          role: 'ADMIN',
          isActive: true,
        },
      });
      console.log('✅ Admin created: admin@biggamma.com / admin123');
    }

    const products = [
      { name: 'Tótem', category: 'PROMO', sku: 'TOT-001' },
      { name: 'Hielera', category: 'EQUIPO', sku: 'HIE-001' },
      { name: 'Banderín', category: 'PROMO', sku: 'BAND-001' },
      { name: 'Cama elástica', category: 'ACTIVACION', sku: 'CAMA-001' },
      { name: 'Mesa promocional', category: 'MOBILIARIO', sku: 'MESA-001' },
      { name: 'Silla gamer', category: 'MOBILIARIO', sku: 'SILLA-001' },
    ];

    for (const product of products) {
      await this.prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      });
    }
    console.log('✅ Default products created');
  }
}