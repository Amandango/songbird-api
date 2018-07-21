import { Texts } from '../models/texts';
import { TextsRepository } from '../repositories/texts.repository';
import { UsersRepository } from "../repositories/users.repository";
export declare class TextController {
    private textsRepo;
    private usersRepo;
    latestTexts: any;
    constructor(textsRepo: TextsRepository, usersRepo: UsersRepository);
    postTextMoment(textMoment: Texts): Promise<any>;
    getTextsById(jwt: string): Promise<Texts[]>;
    getWeekTextsById(jwt: string): Promise<Texts[]>;
    postVoiceRecordingsById(voiceRecording: File): Promise<any>;
}
