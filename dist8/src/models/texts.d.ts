import { Entity } from '@loopback/repository';
export declare class Texts extends Entity {
    id?: number;
    userId: string;
    momentText: string;
    momentTitle: string;
    createdOn: string;
    getId(): number | undefined;
}
