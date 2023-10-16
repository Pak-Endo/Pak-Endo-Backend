import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/schemas/events.schema';
import { UserSchema } from 'src/schemas/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Events', schema: EventSchema},
      {name: 'User', schema: UserSchema}
    ])
  ],
  providers: [CronjobsService]
})
export class CronjobsModule {}
