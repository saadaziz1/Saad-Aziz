import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Performance
  app.use(compression());

  // CORS
  app.enableCors();

  // Swagger Configuration
  const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');
  const config = new DocumentBuilder()
    .setTitle('POS System API')
    .setDescription('The Point of Sale System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.error('VALIDATION ERROR:', JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      },
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
