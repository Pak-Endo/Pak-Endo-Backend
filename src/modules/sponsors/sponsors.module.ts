import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SponsorSchema } from 'src/schemas/sponsor.schema';
import { SponsorController } from './sponsors.controller';
import { SponsorService } from './sponsors.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Sponsors', schema: SponsorSchema}
    ])
  ],
  controllers: [SponsorController],
  providers: [SponsorService]
})
export class SponsorsModule {}
