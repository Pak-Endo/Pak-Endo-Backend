import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/schemas/events.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Events', schema: EventSchema}
    ])
  ],
  providers: [CronjobsService]
})
export class CronjobsModule {}
