import { Module } from '@nestjs/common';
import { AttendedService } from './attended.service';
import { MongooseModule } from '@nestjs/mongoose'
import { AttendedSchema } from 'src/schemas/interested.schema';
import { EventSchema } from 'src/schemas/events.schema';
import { AttendedController } from './attended.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Attended', schema: AttendedSchema},
            {name: 'Events', schema: EventSchema},
        ])
    ],
    controllers: [AttendedController],
    providers: [AttendedService]
})
export class AttendedModule {}
