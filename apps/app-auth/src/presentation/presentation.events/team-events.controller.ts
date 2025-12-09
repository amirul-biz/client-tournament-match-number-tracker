import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserTeamCommand } from '../../application/commands';
import { UpdateUserTeamDto } from '../../domain/dtos';

@Controller()
export class TeamEventsController {
  private readonly logger = new Logger(TeamEventsController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('team.created')
  async handleTeamCreated(@Payload() data: any) {
    this.logger.log('Received team.created event from RabbitMQ');
    this.logger.log(`Team data: ${JSON.stringify(data)}`);

    try {
      // Extract team data from event
      const { id: teamId, name: teamName, userId } = data;

      if (!userId || !teamId || !teamName) {
        this.logger.warn('Missing required fields in team.created event');
        return { success: false, message: 'Missing required fields' };
      }

      // Update user team info via CQRS
      const updateUserTeamDto: UpdateUserTeamDto = {
        userId,
        teamId,
        teamName,
      };

      await this.commandBus.execute(
        new UpdateUserTeamCommand(updateUserTeamDto)
      );

      this.logger.log(
        `Successfully updated user ${userId} with team ${teamId}`
      );
      return { success: true };
    } catch (error) {
      this.logger.error('Error handling team.created event', error);
      return { success: false, message: JSON.stringify(error) };
    }
  }
}
