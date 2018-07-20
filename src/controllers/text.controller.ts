import { repository } from "@loopback/repository";
import { post, requestBody, HttpErrors, get, param } from "@loopback/rest";
import { Texts } from '../models/texts';
import { TextsRepository } from '../repositories/texts.repository';
import { sign, verify } from 'jsonwebtoken';

import S3 = require('aws-sdk/clients/s3');

const { readFileSync } = require('fs');
const { join, extname } = require('path');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('src/config.json');


export class TextController {
  constructor(
    @repository(TextsRepository.name) private textsRepo: TextsRepository
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

      var allTexts = await this.textsRepo.find({ where: { userId: jwtBody.id } });
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
      console.log(jwtBody);

      var testDate = new Date();
      var weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
      var dayInMilliseconds = 24 * 60 * 60 * 1000;
      // testDate.setTime(testDate.getTime() + weekInMilliseconds);
      testDate.setTime(testDate.getTime() + dayInMilliseconds);

      var allWeekTexts = await this.textsRepo.find({
        where: {
          and: [
            { userId: jwtBody.id },
            { createdOn: { between: [testDate, new Date()] } }
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

    var s3 = new AWS.S3();
    var bucketParams = { Bucket: 'songbird-bucket' };
    s3.createBucket(bucketParams)
    // s3 = new AWS.S3({ params: { Bucket: 'songbird-bucket' } })
    var data = { Key: 'recordingFile', Body: voiceRecording };
    s3.putObject(data, function (err: any, data: any) {
      if (err) {
        console.log('Error uploading data: ', data);
      } else {
        console.log('succesfully uploaded the image!');
      }
    });

  }
}