import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../tournament/infrastructure/database';
import { CreateArenaDto, UpdateArenaDto } from './arena.dto';
import { Arena } from '../../generated/prisma';

@Injectable()
export class ArenaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArenaDto): Promise<Arena> {
    return this.prisma.arena.create({ data });
  }

  async findAll(): Promise<Arena[]> {
    return this.prisma.arena.findMany();
  }

  async findOne(id: string): Promise<Arena> {
    const arena = await this.prisma.arena.findUnique({ where: { id } });
    if (!arena) {
      throw new NotFoundException(`Arena with ID ${id} not found`);
    }
    return arena;
  }

  async update(id: string, data: UpdateArenaDto): Promise<Arena> {
    await this.findOne(id); // Check if exists
    return this.prisma.arena.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.prisma.arena.delete({ where: { id } });
  }
}
