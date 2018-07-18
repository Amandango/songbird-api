import { UsersRepository } from "../repositories/users.repository";
export declare class UserController {
    private userRepo;
    constructor(userRepo: UsersRepository);
    getUser(jwt: string): Promise<string | object>;
}
