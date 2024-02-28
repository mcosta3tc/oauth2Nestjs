import { Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { IsBoolean, IsEmail, IsString, Length, Matches } from 'class-validator';
import { BCRYPT_HASH, NAME_REGEX, SLUG_REGEX } from '@common/const/regex.const';
import { UserInterface } from '@interfaces/user.interface';
import { CredentialsEmbeddableEmbeddable } from '@src/embeddables/credentialsEmbeddable.embeddable';
import { UsersExceptionsEnum } from '@users/users.const';

@Entity({ tableName: 'users' })
export class UsersEntity implements UserInterface {
  @PrimaryKey()
  id: number;

  @Property({ columnType: 'varchar', length: 100 })
  @IsString()
  @Length(3, 100)
  @Matches(NAME_REGEX, {
    message: UsersExceptionsEnum.NAME_SPECIALS_CHARACTERS,
  })
  name: string;

  @Property({ columnType: 'varchar', length: 106 })
  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, { message: UsersExceptionsEnum.USERNAME_SLUG })
  username: string;

  @Property({ columnType: 'varchar', length: 255 })
  @IsString()
  @IsEmail()
  @Length(5, 255)
  email: string;

  @Property({ columnType: 'boolean', default: false })
  @IsBoolean()
  confirmed: true | false = false; // since it is saved on the db as binary

  @Property({ columnType: 'varchar', length: 60 })
  @IsString()
  @Length(59, 60)
  @Matches(BCRYPT_HASH)
  password: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Embedded(() => CredentialsEmbeddableEmbeddable)
  credentials: CredentialsEmbeddableEmbeddable =
    new CredentialsEmbeddableEmbeddable();
}
