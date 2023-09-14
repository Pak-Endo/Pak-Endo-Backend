import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema}]),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
