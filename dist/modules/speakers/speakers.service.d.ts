import { Model } from "mongoose";
import { Speaker } from "src/schemas/speakers.schema";
import { SpeakerDto } from "src/dto/speaker.dto";
export declare class SpeakerService {
    private readonly speakerModel;
    constructor(speakerModel: Model<Speaker>);
    getAllSpeakers(limit: number, offset: number, speakerName?: string): Promise<any>;
    getSpeakerById(speakerID: string): Promise<any>;
    addNewSpeaker(speaker: SpeakerDto): Promise<any>;
    updateSpeaker(speakerID: string, speakerData: SpeakerDto): Promise<any>;
    deleteSpeaker(speakerID: string): Promise<any>;
    deleteAllSpeakers(): Promise<import("mongodb").DeleteResult>;
}
