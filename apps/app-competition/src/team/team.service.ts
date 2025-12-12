import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../../tournament/infrastructure/database';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';
import { Team } from '../../generated/prisma';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('AUTH_SERVICE_CLIENT') private readonly rmqClient: ClientProxy,
  ) {}

  async create(data: CreateTeamDto): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        name: data.name,
        userId: data.userId!,
      },
    });

    // Event sourcing - emit event to RabbitMQ
    this.rmqClient.emit('team.created', {
      id: team.id,
      name: team.name,
      userId: team.userId,
      timestamp: new Date(),
    }).subscribe({
      error: (err) => this.logger.error('RabbitMQ emit error:', err),
    });

    this.logger.log(`Team created: ${team.id}`);
    return team;
  }

  async findAll(): Promise<Team[]> {
    return this.prisma.team.findMany();
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async update(id: string, data: UpdateTeamDto): Promise<Team> {
    await this.findOne(id); // Check if exists

    const team = await this.prisma.team.update({
      where: { id },
      data,
    });

    // Event sourcing - emit update event
    this.rmqClient.emit('team.updated', {
      id: team.id,
      changes: data,
      timestamp: new Date(),
    }).subscribe({
      error: (err) => this.logger.error('RabbitMQ emit error:', err),
    });

    return team;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists

    await this.prisma.team.delete({ where: { id } });

    // Event sourcing - emit delete event
    this.rmqClient.emit('team.deleted', {
      id,
      timestamp: new Date(),
    }).subscribe({
      error: (err) => this.logger.error('RabbitMQ emit error:', err),
    });
  }
}
