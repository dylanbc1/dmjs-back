import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: '*', // Specify the allowed origin
    credentials: true, // Allow credentials (cookies, authorization headers)
  });
  // Con esto, se habilita la documentación de la API en la ruta /documentation
  const config = new DocumentBuilder()
    .setTitle('DMJS STORE')
    .setDescription('The DMJS STORE API description')
    .setVersion('1.0')
    .addTag('e-commerce')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
