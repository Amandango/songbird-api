import { repository } from "@loopback/repository";
import { post, requestBody, HttpErrors, get, param, patch } from "@loopback/rest";
import { Texts } from '../models/texts';
import { TextsRepository } from '../repositories/texts.repository';
import { UsersRepository } from "../repositories/users.repository";
import { sign, verify } from 'jsonwebtoken';
var moment = require('moment');

import S3 = require('aws-sdk/clients/s3');

const { readFileSync } = require('fs');
const { join, extname } = require('path');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('src/config.json');


export class TextController {

  public latestTexts: any;
  // public streak: number;

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
    // s3 = new AWS.S3({ params: { Bucket: 'songbird-bucket' } })
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

  // @get('/getStreak')
  // async getStreak(@param.query.string('jwt') jwt: string): Promise<any> {
  //   if (!jwt) throw new HttpErrors.Unauthorized('JWT token is required');

  //   try {
  //     var jwtBody = verify(jwt, 'encryption') as any;
  //     console.log(jwtBody);

  //     this.latestTexts = this.textsRepo.find({
  //       where: {
  //         userId: jwtBody.id,

  //         order: 'createdOn DESC'
  //       }
  //     });

  //     try {
  //       var lastText = this.latestTexts[0];

  //       var currentUser = this.usersRepo.findOne({
  //         where:
  //           { userId: jwtBody.id }
  //       }
  //       );

  //       if (lastText.getDate() - new Date().getDate() == ) {
  //         currentUser.streak += 1

  //         async postStreak(@)
  //       }

  //       return currentUser.streak;
  //     }

  //     catch (err) {
  //       throw new HttpErrors.BadRequest('Error finding latest moment');
  //     }

  //   }

  //   catch (err) {
  //     throw new HttpErrors.BadRequest('JWT token invalid');
  //   }
  // };

//   @patch('/updateUserStreak')
//   async updateUserStreak(@param.query.string('jwt') jwt: string): Promise<any> {
//   if (!jwt) throw new HttpErrors.Unauthorized('JWT token is required');

//   try {
//     var jwtBody = verify(jwt, 'encryption') as any;
//     console.log(jwtBody);

//     await this.usersRepo.updateById(jwtBody.id, obj);

//   }

//   catch (err) {
//     throw new HttpErrors.BadRequest('JWT token invalid');
//   };

// }


  // @get('/streak')
  // async getStreak(@param.query.string('jwt') jwt: string): Promise<any> {
  //   if (!jwt) throw new HttpErrors.Unauthorized('JWT token is required');

  //   try {
  //     var jwtBody = verify(jwt, 'encryption') as any;
  //     console.log(jwtBody);
      
  //     await this.textsRepo.find(
  //       {where: {userId: jwtBody.user.id}
  //     },

  //     { order: 'createdOn ASC'}

  //   ).then( texts => {

  //     console.log(texts[0].createdOn)

  //     var currentTime = moment();
  //     var timeStore = moment(texts[0].createdOn)

  //     var streak = currentTime.diff(timeStore, 'h');
  //     console.log(streak);

  //     // console.log('this is the diff' + moment(moment.duration(moment(new Date()).diff(texts[0].createdOn))));

  //     // if(moment(moment.duration(moment(new Date()).diff(texts[0].createdOn))) <= moment(''))

  //     // for (var i = 0; i < texts.length; i++)
  //     // if (moment(moment.duration(moment(new Date()).diff(texts[i].createdOn)).format('hh:mm:ss') <= moment('24:00:00').format('hh:mm:ss'))) {
  //     //   this.streak += 1;
  //     // }
  //     // else {
  //     //   this.streak = 0;
  //     // }
  //   } )
  //   } catch (err) {
  //     throw new HttpErrors.BadRequest('JWT token invalid');
  //   }
  // }
}