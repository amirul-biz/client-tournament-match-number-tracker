import { Injectable } from '@nestjs/common';
import { Team } from '../../../../generated/prisma';
import { PrismaService } from '../../database';
import { CreateTeamDto, UpdateTeamDto } from '../../../domain/dtos';

@Injectable()
export class TeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTeamDto): Promise<Team> {
    return this.prisma.team.create({ data });
  }

  async findAll(): Promise<Team[]> {
    return this.prisma.team.findMany();
  }

  async findById(id: string): Promise<Team | null> {
    return this.prisma.team.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTeamDto): Promise<Team> {
    return this.prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Team> {
    return this.prisma.team.delete({
      where: { id },
    });
  }
}
