import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VenueSchema } from 'src/schemas/venues.schema';
import { VenueController } from './venues.controller';
import { VenueService } from './venues.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Venues', schema: VenueSchema}
    ])
  ],
  controllers: [VenueController],
  providers: [VenueService]
})
export class VenuesModule {}
