import { repository } from "@loopback/repository";
import { UsersRepository } from "../repositories/users.repository";
import { post, requestBody, HttpErrors, get } from "@loopback/rest";
import { Login } from "../models/login";
import { sign, verify} from 'jsonwebtoken'

import * as bcrypt from 'bcrypt';

export class LoginController {
  public currentUser: any;
  constructor(
    @repository(UsersRepository.name) private userRepo: UsersRepository
  ) {}

  @post('/login')
    async login(@requestBody() login: Login): Promise<any> {

        if (!login.email || !login.password) {
            throw new HttpErrors.Unauthorized('invalid credentials');
        }
      

        let userExists: boolean = !!(await this.userRepo.count({
            and: [
                { email: login.email },
            ],
        }));

        if (!userExists) {
            throw new HttpErrors.Unauthorized('user does not exist');
        }


        this.currentUser = await this.userRepo.findOne({where: {email: login.email}});

        if (await bcrypt.compare(login.password, this.currentUser.password)) {

        var jwt = sign(
            {
              user: {
                id: this.currentUser.id,
                firstname: this.currentUser.firstname,
                lastname: this.currentUser.lastname,
                email: this.currentUser.email
              },
            },
            'encryption',
            {
              issuer: 'auth.songbird',
              audience: 'songbird',
            },
          );
          
          return {
            token: jwt,
          };

        }

        throw new HttpErrors.Unauthorized('Incorrect password.');
    }

}
