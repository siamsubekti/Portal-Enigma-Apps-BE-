import { Module, Global } from '@nestjs/common';
import { AppConfig } from '../config/app.config';
import { HashUtil } from './utilities/hash.util';
import ResponseUtil from './response/response.util';

@Global()
@Module({
  imports: [AppConfig],
  exports: [HashUtil, ResponseUtil],
  providers: [HashUtil, ResponseUtil],
})
export class LibraryModule {}
