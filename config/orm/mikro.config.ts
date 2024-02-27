import { Options } from '@mikro-orm/core';
import { defineConfig, LoadStrategy } from '@mikro-orm/postgresql';
import * as process from 'process';

export const mikroConfig: Options = defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js', 'dist/**/*.embeddable.js'],
  entitiesTs: ['src/**/*.entity.ts', 'src/**/*.embeddable.ts'],
  loadStrategy: LoadStrategy.JOINED,
  allowGlobalContext: true,
});
