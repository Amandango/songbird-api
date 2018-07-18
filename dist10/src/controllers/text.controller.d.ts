import { Texts } from '../models/texts';
import { TextsRepository } from '../repositories/texts.repository';
export declare class TextController {
    private textsRepo;
    constructor(textsRepo: TextsRepository);
    postTextMoment(textMoment: Texts): Promise<any>;
    getTextsById(jwt: string): Promise<Texts[]>;
    postVoiceRecordingsById(voiceRecording: any): Promise<any>;
}
