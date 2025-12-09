import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { googleId: string; name: string }) {
    return await this.prisma.user.create({
      data,
    });
  }

  async ifUserExist(data: { googleId: string }): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { googleId: data.googleId },
    });

    return !!user;
  }
}
