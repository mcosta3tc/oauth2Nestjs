import { Embeddable, Property } from '@mikro-orm/core';
import { CredentialsInterface } from '@interfaces/credentials.interface';
import dayjs from 'dayjs';

@Embeddable()
export class CredentialsEmbeddableEmbeddable implements CredentialsInterface {
  @Property({ default: '0' })
  version = 0;

  @Property({ default: '' })
  lastPassword = '';

  @Property({ default: dayjs().unix() })
  passwordUpdatedAt: number = dayjs().unix();

  @Property({ default: dayjs().unix() })
  updatedAt: number = dayjs().unix();

  updatePassword(password: string): void {
    this.version++;
    this.lastPassword = password;
    const now = dayjs().unix();
    this.passwordUpdatedAt = now;
    this.updatedAt = now;
  }
  updateVersion(): void {
    this.version++;
    this.updatedAt = dayjs().unix();
  }
}
