import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpeakerSchema } from 'src/schemas/speakers.schema';
import { SpeakerController } from './speakers.controller';
import { SpeakerService } from './speakers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Speakers', schema: SpeakerSchema}
    ])
  ],
  controllers: [SpeakerController],
  providers: [SpeakerService]
})
export class SpeakersModule {}
