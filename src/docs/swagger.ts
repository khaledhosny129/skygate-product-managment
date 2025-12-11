import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function initSwagger(
  app: INestApplication
): void {
  const options = new DocumentBuilder()
    .setTitle('Sky gate task')
    .setDescription('Sky gate task Api documentation')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}