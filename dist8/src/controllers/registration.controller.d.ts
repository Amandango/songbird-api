import { UsersRepository } from '../repositories/users.repository';
import { Users } from '../models/users';
export declare class RegistrationController {
    private userRepo;
    constructor(userRepo: UsersRepository);
    register(newUser: Users): Promise<any>;
}
