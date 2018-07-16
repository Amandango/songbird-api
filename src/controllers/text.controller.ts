import { repository } from "@loopback/repository";
import { post, requestBody, HttpErrors, get, param } from "@loopback/rest";
import { Texts } from '../models/texts';
import { TextsRepository } from '../repositories/texts.repository';
import { sign, verify } from 'jsonwebtoken';


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
}