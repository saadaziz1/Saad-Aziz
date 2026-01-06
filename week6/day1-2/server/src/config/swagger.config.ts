import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Ecommerce API')
  .setDescription('Production-ready Ecommerce Backend')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
