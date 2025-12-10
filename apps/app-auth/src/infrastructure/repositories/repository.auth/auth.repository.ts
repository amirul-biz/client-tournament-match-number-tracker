import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database';
import { User } from '../../generated/prisma';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { googleId: string; name: string }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateRefreshToken(googleId: string, refreshToken: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { googleId },
      data: { refreshToken },
    });
  }
}
