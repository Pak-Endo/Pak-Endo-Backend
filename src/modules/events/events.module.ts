import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/schemas/events.schema';
import { EventsController } from './events.controller';
import { GallerySchema } from 'src/schemas/gallery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Events', schema: EventSchema},
      {name: 'Gallery', schema: GallerySchema},
    ])
  ],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
