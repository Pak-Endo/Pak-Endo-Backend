import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config';
import { UserModule } from './modules/user/user.module';
import { EventsModule } from './modules/events/events.module';
import { MediaUploadModule } from './modules/media-upload/media-upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsModule } from './modules/cronjobs/cronjobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/config/development.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(config.mongoURI),
    AuthModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    EventsModule,
    MediaUploadModule,
    CronjobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
