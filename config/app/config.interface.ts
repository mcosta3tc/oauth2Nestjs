import { JwtTokensInterfaces } from '@config/app/jwt.config.interface';
import { EmailConfigInterface } from '@config/app/email.config.interface';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

export interface ConfigInterface {
  id: string;
  port: number;
  domain: string;
  database: MikroOrmModuleOptions;
  jwtToken: JwtTokensInterfaces;
  emailService: EmailConfigInterface;
}
