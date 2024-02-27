import { JwtToken } from '@config/app/jwt.config.interface';
import { EmailConfig } from '@config/app/email.config.interface';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

export interface Config {
  id: string;
  port: number;
  domain: string;
  database: MikroOrmModuleOptions;
  jwtToken: JwtToken;
  emailService: EmailConfig;
}
