import { repository } from "@loopback/repository";
import { post, requestBody, HttpErrors, get, param, patch } from "@loopback/rest";
import { Texts } from '../models/texts';
import { TextsRepository } from '../repositories/texts.repository';
import { UsersRepository } from "../repositories/users.repository";
import { sign, verify } from 'jsonwebtoken';

import S3 = require('aws-sdk/clients/s3');

const AWS = require('aws-sdk');
AWS.config.loadFromPath('src/config.json');


export class TextController {

  public latestTexts: any;
  public streak: number;

  constructor(
    @repository(TextsRepository.name) private textsRepo: TextsRepository,
    @repository(UsersRepository.name) private usersRepo: UsersRepository
  ) { }

  @post('/texts')
  async postTextMoment(@requestBody() textMoment: Texts): Promise<any> {
    return await this.textsRepo.create(textMoment);
  }

  @get('/getTextsById')
  async getTextsById(@param.query.string('jwt') jwt: string): Promise<Texts[]> {
    if (!jwt) throw new HttpErrors.Unauthorized('JWT token is required');

    try {
      var jwtBody = verify(jwt, 'encryption') as any;
      console.log(jwtBody);
      console.log(jwtBody.user.id);

      var allTexts = await this.textsRepo.find({
        where: {userId: jwtBody.user.id}
      }
    );
      console.log(allTexts);
      console.log(allTexts[0].createdOn);
      return allTexts;
    } catch (err) {
      throw new HttpErrors.BadRequest('JWT token invalid');
    }
  }

  @get('/getWeekTextsById')
  async getWeekTextsById(@param.query.string('jwt') jwt: string): Promise<Texts[]> {
    if (!jwt) throw new HttpErrors.Unauthorized('JWT token is required');

    try {
      var jwtBody = verify(jwt, 'encryption') as any;
      console.log(jwtBody.user.id);

      var testDate = new Date();
      var weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
      testDate.setTime(testDate.getTime() - weekInMilliseconds)
      var stringTestDate = testDate.toISOString();
      var currentDate = new Date().toISOString();

      var allWeekTexts = await this.textsRepo.find({
        where: {
          and: [
            { userId: jwtBody.user.id },
            { createdOn: { between: [stringTestDate, currentDate] } }
          ]
        }
      });
      return allWeekTexts;
    } catch (err) {
      throw new HttpErrors.BadRequest('JWT token invalid');
    }
  }

  @post('/postVoiceRecordings')
  async postVoiceRecordingsById(@requestBody() voiceRecording: any): Promise<any> {
    
    console.log('trying to work');
    console.log(voiceRecording);
    var newDate = new Date();

    var s3 = new AWS.S3();
    var bucketParams = { Bucket: 'songbird-bucket' };
    s3.createBucket(bucketParams)
    var data = { Key: newDate, Body: voiceRecording };
    s3.putObject(data, function (err: any, data: any) {
      if (err) {
        console.log('Error uploading data: ', data);
      } else {
        console.log('succesfully uploaded the image!');
      }
    });
    return voiceRecording
  }
}