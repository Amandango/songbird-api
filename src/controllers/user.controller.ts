import { repository } from "@loopback/repository";
import { UsersRepository } from "../repositories/users.repository";
import { post, requestBody, HttpErrors, get, param } from "@loopback/rest";
import { Login } from "../models/login";
import { sign, verify} from 'jsonwebtoken'

export class UserController {
  constructor(
    @repository(UsersRepository.name) private userRepo: UsersRepository
  ) {}

  @get('/User')
    async getUser(@param.query.string('jwt') jwt: string) {
      if (!jwt) throw new HttpErrors.Unauthorized('JWT token is required.');

      try {
        var jwtBody = verify(jwt, 'encryption');
        return jwtBody;

      } catch (err) {
        throw new HttpErrors.BadRequest('JWT token invalid');
      }
    }
}
