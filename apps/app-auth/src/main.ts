import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const rabbitMQConfig: MicroserviceOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
    queue: 'microservices_events_queue', // General queue for all microservices
    queueOptions: {
      durable: false,
    },
  },
};

  const app = await NestFactory.create(AppModule);

  // Only connect to RabbitMQ if it's available
  try {
    app.connectMicroservice<MicroserviceOptions>(rabbitMQConfig);
    await app.startAllMicroservices();
    Logger.log('✅ RabbitMQ microservice connected successfully');
  } catch (error) {
    Logger.warn('⚠️  RabbitMQ connection failed - running without microservices');
    Logger.warn('   Start RabbitMQ with: docker compose up -d');
  }

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port =  5000;


  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API Doc for Auth microservice')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);


  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();
