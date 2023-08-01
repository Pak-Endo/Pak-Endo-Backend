import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication | any>(AppModule);
  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ limit: '500mb' }));

  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.setViewEngine('hbs');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  const config = new DocumentBuilder()
    .setTitle('Event-Manager')
    .setDescription('Event-Manager APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Event-Manager APIs')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
