import { AttendedService } from './attended.service';
import { AttendedDto } from 'src/dto/attended.dto';
export declare class AttendedController {
    private readonly attendService;
    constructor(attendService: AttendedService);
    getAttended(limit: number, offset: number, req: any): Promise<{
        data: any[];
    }>;
    getFavById(id: string, req: any): Promise<any[]>;
    addToAttendedEvents(AttendedDto: AttendedDto, req: any): Promise<{
        message: string;
    }>;
}
