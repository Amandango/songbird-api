import { juggler, AnyObject } from '@loopback/repository';
export declare class MydatasourceDataSource extends juggler.DataSource {
    static dataSourceName: string;
    constructor(dsConfig?: AnyObject);
}
