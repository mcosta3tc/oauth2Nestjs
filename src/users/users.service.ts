import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UsersEntity } from '@users/users.entity';
import { EntityManager } from '@mikro-orm/core';
import { CommonService } from '@common/common.service';
import { hash } from 'bcrypt';
import { isNull, isUndefined } from '@common/utils/validation.utils';
import { UsersExceptionsEnum } from '@users/users.const';
import { UserUpdateDto } from '@src/dto/users/userUpdateDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: EntityManager,
    private readonly commonService: CommonService,
  ) {}

  async create(
    email: string,
    name: string,
    password: string,
  ): Promise<UsersEntity> {
    await this.checkEmailUniqueness(email);
    const formattedName = this.commonService.formatName(name);

    const user = this.userRepository.create(UsersEntity, {
      email: email.toLowerCase(),
      name: formattedName,
      username: await this.generateUsername(formattedName),
      password: await hash(password, 10),
    });

    await this.commonService.saveEntity(this.userRepository, user);
    return user;
  }

  async findOneById(id: number): Promise<UsersEntity> {
    const user = this.userRepository.findOne(UsersEntity, { id });
    this.commonService.checkEntityExistence(user, 'User');
    return user;
  }

  async findOneByEmail(email: string): Promise<UsersEntity> {
    const user = await this.userRepository.findOne(UsersEntity, {
      email: email.toLowerCase(),
    });
    this.throwUnauthorizedException(user);
    return user;
  }

  async uncheckedUserByEmail(email: string): Promise<UsersEntity> {
    return this.userRepository.findOne(UsersEntity, {
      email: email.toLowerCase(),
    });
  }

  async findOneByCredentials(
    id: number,
    version: number,
  ): Promise<UsersEntity> {
    const user = await this.userRepository.findOne(UsersEntity, { id });
    this.throwUnauthorizedException(user);
    if (user.credentials.version !== version) {
      throw new UnauthorizedException(UsersExceptionsEnum.INVALID_CREDENTIALS);
    }
    return user;
  }

  async findOneByUsername(
    username: string,
    forAuth: boolean = false,
  ): Promise<UsersEntity> {
    const user = await this.userRepository.findOne(UsersEntity, {
      username: username.toLowerCase(),
    });

    if (forAuth) {
      this.throwUnauthorizedException(user);
    } else {
      this.commonService.checkEntityExistence(user, 'User');
    }

    return user;
  }

  async update(id: number, dto: UserUpdateDto): Promise<UsersEntity> {
    const user = await this.userRepository.findOne(UsersEntity, { id });
    const { name, username } = dto;

    if (!isUndefined(name) || !isNull(name)) {
      if (name === user.name) {
        throw new BadRequestException(UsersExceptionsEnum.NAME_MUST_DIFFERENT);
      }

      user.name = this.commonService.formatName(name);
    }

    if (!isUndefined(username) || !isNull(name)) {
      const formattedUsername = dto.username.toLowerCase();

      if (username === user.username) {
        throw new BadRequestException(
          UsersExceptionsEnum.USERNAME_MUST_DIFFERENT,
        );
      }

      await this.checkUsernameUniqueness(formattedUsername);
      user.username = formattedUsername;
    }

    await this.commonService.saveEntity(this.userRepository, user);
    return user;
  }

  private throwUnauthorizedException(
    user: undefined | null | UsersEntity,
  ): void {
    if (isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException(UsersExceptionsEnum.INVALID_CREDENTIALS);
    }
  }

  /**
   * Generate Username
   *
   * Generates a unique username using a point slug based on the name
   * and if it's already in use, it adds the usernames count to the end
   */
  private async generateUsername(name: string): Promise<string> {
    const pointSlug = this.commonService.generatePointSlug(name);
    const count = await this.userRepository.count(UsersEntity, {
      username: {
        $like: `${pointSlug}`,
      },
    });

    if (count > 0) {
      return `${pointSlug}${count}`;
    }

    return pointSlug;
  }

  private async checkEmailUniqueness(email: string): Promise<void> {
    const count = await this.userRepository.count(UsersEntity, { email });
    if (count > 0) {
      throw new ConflictException(UsersExceptionsEnum.EMAIL_EXISTS);
    }
  }

  private async checkUsernameUniqueness(username: string): Promise<void> {
    const count = await this.userRepository.count(UsersEntity, { username });

    if (count > 0) {
      throw new ConflictException('Username already in use');
    }
  }
}
