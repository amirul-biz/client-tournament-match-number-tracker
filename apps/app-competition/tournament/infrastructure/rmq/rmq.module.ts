// libs/tournament/teams/src/lib/team-rmq-client.module.ts

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE_CLIENT', // A token to inject the client later
        transport: Transport.RMQ,
        options: {
          urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
          queue: 'microservices_events_queue', // General queue for all microservices
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RmqClientModule {}
