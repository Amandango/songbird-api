import {SongbirdApiApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {SongbirdApiApplication};

export async function main(options?: ApplicationConfig) {
  const app = new SongbirdApiApplication(options);
  await app.boot();
  await app.start();
  return app;
}
