import { Entity } from '@loopback/repository';
export declare class Login extends Entity {
    id?: number;
    email: string;
    password: string;
    getId(): number | undefined;
}
