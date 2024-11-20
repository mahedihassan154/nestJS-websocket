import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalService } from './common/global.service';
require('dotenv').config();
// const log = new Logger('main');



const RED = '\x1b[31m\n';
const GREEN = '\x1b[32m\n';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

async function bootstrap() {
  GlobalService.environmentVariable = {};
  let globalService = new GlobalService();
  await globalService.setGlobalVriable();

  const app = await NestFactory.create(AppModule);

  if ('production' !== globalService.setGlobalVriable['NODE_ENV']) {
    const options = new DocumentBuilder()
      .setTitle(`market data`)
      .setDescription(
        `API Endpoint List`,
      )
      .setVersion('0.0.1')
      .addTag('market data')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/v1', app, document);
  }
  
  const PORT = GlobalService.environmentVariable['PORT'] || 5000;
  await app.listen(PORT);
  console.log(`${BLUE} **** market data APPLICATION START ****${RESET}`);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
