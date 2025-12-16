import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../tournament/infrastructure/database';
import { CreateParticipantDto, UpdateParticipantDto } from './participant.dto';
import { Participant } from '@app-competition/prisma';

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
    // Process in batches of 100 to avoid overwhelming the database
    const BATCH_SIZE = 100;
    let totalCount = 0;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      // Clean the data - ensure only valid fields
      const cleanedBatch = batch.map((item) => ({
        name: item.name?.trim(),
        teamId: item.teamId,
        categoryId: item.categoryId,
      }));

      const result = await this.prisma.participant.createMany({
        data: cleanedBatch,
        skipDuplicates: true, // Skip if duplicate exists
      });

      totalCount += result.count;
    }

    return { count: totalCount };
  }

  async findAll(): Promise<
    {
      id: string;
      name: string;
      teamId: string;
      categoryId: string;
      team: {
        id: string;
        name: string;
      };
      category: {
        id: string;
        name: string;
      };
    }[]
  > {
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
