import {DatasourceApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {DatasourceApplication};

export async function main(options?: ApplicationConfig) {
  const app = new DatasourceApplication(options);
  await app.boot();
  await app.start();
  return app;
}
