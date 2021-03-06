import 'reflect-metadata';
import * as moment from 'moment-timezone';
import * as cookieParser from 'cookie-parser';
import * as limiter from 'express-rate-limit';
import * as compression from 'compression';
import * as helmet from 'helmet';
// import * as csurf from 'csurf';
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

  app.enableCors({ origin: process.env.API_DOMAIN, credentials: true });
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());
  app.use(limiter({ windowMS: 600000, max: 100 }));
  // app.use(csurf({ cookie: { secure: true, httpOnly: true, maxAge: 3600, key: process.env.CSRF_TOKEN_NAME} }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'assets'));
  // app.setBaseViewsDir(join(__dirname, 'views'));
  // app.setViewEngine('hbs');

  moment.tz.setDefault(process.env.TZ);
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
    .setSchemes('https', 'http')
    .addTag('Authentication')
    .addTag('Accounts');

  const document: SwaggerDocument = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('swagger-ui', app, document);
}

bootstrap();
