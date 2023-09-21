import { SpeakerService } from './speakers.service';
import { SpeakerDto } from 'src/dto/speaker.dto';
export declare class SpeakerController {
    private readonly speakerService;
    constructor(speakerService: SpeakerService);
    postNewSpeaker(speakerDto: SpeakerDto): Promise<any>;
    updateSpeakerData(speakerDto: SpeakerDto, speakerID: string): Promise<any>;
    deleteSpeakerByID(speakerID: string): Promise<any>;
    fetchAllSpeakers(limit: number, offset: number, speakerName?: string): Promise<any>;
    fetchSpeakerByID(speakerID: string): Promise<any>;
}
