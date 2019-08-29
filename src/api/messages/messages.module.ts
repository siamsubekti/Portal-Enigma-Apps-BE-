import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AccountModule from '../accounts/account.module';
import Message from './models/message.entity';
import MessageController from './controllers/message.controller';
import MessageService from './services/message.service';

@Module({
  controllers: [ MessageController ],
  imports: [ TypeOrmModule.forFeature([ Message ]), AccountModule ],
  exports: [ MessageService ],
  providers:  [ MessageService ],
})
export default class MessageModule {}
