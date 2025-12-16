import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../tournament/infrastructure/database';
import { CreateParticipantDto, UpdateParticipantDto } from './participant.dto';
import { Participant } from '../../generated/prisma';

@Injectable()
export class ParticipantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateParticipantDto): Promise<Participant> {
    return this.prisma.participant.create({
      data: {
        name: data.name,
        teamId: data.teamId,
        categoryId: data.categoryId,
      },
      include: {
        team: true,
        category: true,
      },
    });
  }

  async createMany(data: CreateParticipantDto[]): Promise<{ count: number }> {
    return this.prisma.participant.createMany({ data });
  }

  async findAll(): Promise<Participant[]> {
    return this.prisma.participant.findMany({
      include: {
        team: true,
        category: true,
      },
    });
  }

  async findOne(id: string): Promise<Participant> {
    const participant = await this.prisma.participant.findUnique({
      where: { id },
      include: {
        team: true,
        category: true,
      },
    });
    if (!participant) {
      throw new NotFoundException(`Participant with ID ${id} not found`);
    }
    return participant;
  }

  async update(id: string, data: UpdateParticipantDto): Promise<Participant> {
    await this.findOne(id); // Check if exists
    return this.prisma.participant.update({
      where: { id },
      data,
      include: {
        team: true,
        category: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.prisma.participant.delete({ where: { id } });
  }
}
