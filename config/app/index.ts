import { readFileSync } from 'fs';
import { Config } from '@config/app/config.interface';
import { join } from 'path';
import * as process from 'process';
import { defineConfig, LoadStrategy } from '@mikro-orm/postgresql';

export function appConfig(): Config {
  const publicKey = readFileSync(
    join(__dirname, '..', 'keys/public.key'),
    'utf-8',
  );
  const privateKey = readFileSync(
    join(__dirname, '..', 'keys/private.key'),
    'utf-8',
  );

  return {
    id: process.env.APP_ID,
    port: parseInt(process.env.PORT, 10),
    domain: process.env.DOMAIN,
    jwtToken: {
      access: {
        privateKey,
        publicKey,
        time: parseInt(process.env.JWT_ACCESS_TIME, 10),
      },
      confirmation: {
        secret: process.env.JWT_CONFIRMATION_SECRET,
        time: parseInt(process.env.JWT_CONFIRMATION_TIME, 10),
      },
      resetPassword: {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
        time: parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10),
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        time: parseInt(process.env.JWT_REFRESH_TIME),
      },
    },
    emailService: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    database: defineConfig({
      clientUrl: process.env.DATABASE_URL,
      entities: ['dist/**/*.entity.js', 'dist/**/*.embeddable.js'],
      entitiesTs: ['src/**/*.entity.ts', 'src/**/*.embeddable.ts'],
      loadStrategy: LoadStrategy.JOINED,
      allowGlobalContext: true,
    }),
  };
}
