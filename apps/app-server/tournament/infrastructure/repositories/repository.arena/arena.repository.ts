import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../src/prisma/prisma.service';
import { CreateArenaDto, UpdateArenaDto } from '../../../domain/dtos';
import { Arena } from '../../../../../../generated/prisma/client';

@Injectable()
export class ArenaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArenaDto): Promise<Arena> {
    return this.prisma.arena.create({
      data,
    });
  }

  async findAll(): Promise<Arena[]> {
    return this.prisma.arena.findMany();
  }

  async findById(id: string): Promise<Arena | null> {
    return this.prisma.arena.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateArenaDto): Promise<Arena> {
    return this.prisma.arena.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Arena> {
    return this.prisma.arena.delete({
      where: { id },
    });
  }
}
