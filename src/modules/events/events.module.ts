import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/schemas/events.schema';
import { EventsController } from './events.controller';
import { GallerySchema } from 'src/schemas/gallery.schema';
import { AgendaSchema } from 'src/schemas/agenda.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Events', schema: EventSchema},
      {name: 'Gallery', schema: GallerySchema},
      {name: 'Agenda', schema: AgendaSchema},
    ])
  ],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
