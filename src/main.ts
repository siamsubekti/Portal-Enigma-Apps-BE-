import 'reflect-metadata';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import * as limiter from 'express-rate-limit';
import { join } from 'path';
import { NestFactory, NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import { SwaggerModule, DocumentBuilder, SwaggerDocument } from '@nestjs/swagger';
import AppConfig from './config/app.config';
import ApiModule from './api/api.module';
import HttpExceptionFilter from './libraries/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(ApiModule, getServerOptions());

  generateSwagger(app);

  app.enableCors();
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());
  // app.use(csurf());
  app.use(limiter({ windowMS: 10 * 60 * 1000, max: 100 }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'assets'));
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  await app.listen(process.env.API_PORT, '0.0.0.0');
}

function getServerOptions(): NestApplicationOptions {
  const config: AppConfig = new AppConfig();

  return config.serverOptions();
}

function generateSwagger(app: NestApplication): void {
  const config: AppConfig = new AppConfig();
  const options: DocumentBuilder = new DocumentBuilder();

  options.setTitle(config.get('API_NAME'))
    .setDescription(`Description of ${config.get('API_NAME')}`)
    .setVersion(config.getPackageInfo('version'))
    .setHost(config.get('API_BASE_URL').replace('https://', '').replace('http://', ''))
    .setSchemes('http', 'https');

  const document: SwaggerDocument = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('swagger-ui', app, document);
}

bootstrap();
