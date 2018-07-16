import { DefaultCrudRepository } from '@loopback/repository';
import { DataSource } from 'loopback-datasource-juggler';
import { Texts } from '../models/texts';
export declare class TextsRepository extends DefaultCrudRepository<Texts, typeof Texts.prototype.id> {
    protected datasource: DataSource;
    constructor(datasource: DataSource);
}
