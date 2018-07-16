import { DefaultCrudRepository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { DataSource } from 'loopback-datasource-juggler';
import { Texts } from '../models/texts';

export class TextsRepository extends DefaultCrudRepository<
    Texts,
    typeof Texts.prototype.id
> {
    constructor(@inject('datasources.db') protected datasource: DataSource) {
        super(Texts, datasource);
    }
}