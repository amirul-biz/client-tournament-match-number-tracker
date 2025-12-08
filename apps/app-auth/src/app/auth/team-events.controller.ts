import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class TeamEventsController {
  private readonly logger = new Logger(TeamEventsController.name);

  @EventPattern('team.created')
  async handleTeamCreated(@Payload() data: any) {
    this.logger.log('Received team.created event from RabbitMQ');
    this.logger.log(`Team data: ${JSON.stringify(data)}`);

    // TODO: Implement your business logic here
    // For example:
    // - Create user permissions for the team
    // - Send notifications
    // - Update user roles
    // - Sync team data to auth database

    return { success: true };
  }
}
