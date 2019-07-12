import { Module, Global } from '@nestjs/common';
import { HashUtil } from './utilities/hash.util';
import ResponseUtil from './response/response.util';
import { ConfigModule } from '../config/config.module';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [HashUtil, ResponseUtil],
  providers: [HashUtil, ResponseUtil],
})
export class LibraryModule {}
