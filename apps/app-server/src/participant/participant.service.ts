import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, teamId: string, categoryId: string) {
    return this.prisma.participant.create({
      data: {
        name,
        teamId,
        categoryId,
      },
      include: {
        team: true,
        category: true,
      },
    });
  }

  async createMany(data: CreateParticipantDto[]) {
    return this.prisma.participant.createMany({
      data,
    });
  }

  async findAll() {
    return this.prisma.participant.findMany({
      include: {
        team: true,
        category: true,
      },
    });
  }
}
