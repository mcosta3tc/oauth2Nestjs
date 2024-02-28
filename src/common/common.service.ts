import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { Dictionary, EntityManager } from '@mikro-orm/core';
import { validate } from 'class-validator';
import { isNull, isUndefined } from '@common/utils/validation.utils';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { ReturnMessage } from '@interfaces/message.interface';

@Injectable()
export class CommonService {
  private readonly loggerService: LoggerService;

  constructor() {
    this.loggerService = new Logger(CommonService.name);
  }

  /**
   * Validate Entity
   *
   * Validates an entities with the class-validator library
   */
  async validateEntity(entity: Dictionary): Promise<void> {
    const errors = await validate(entity);
    const messages: string[] = [];

    for (const error of errors) {
      messages.push(...Object.values(error.constraints));
    }

    if (errors.length > 0) {
      throw new BadRequestException(messages.join(',\n'));
    }
  }

  /**
   * Throw Duplicate Error
   *
   * Checks is an error is of the code 23505, PostgresSQL's duplicate value error,
   * and throws a conflict exception
   */
  async throwDuplicateError<T>(promise: Promise<T>, message?: string) {
    try {
      return await promise;
    } catch (error) {
      this.loggerService.error(error);

      if (error.code === '23505') {
        throw new ConflictException(message ?? 'Duplicated value in database');
      }

      throw new BadRequestException(error.message);
    }
  }

  /**
   * Throw Internal Error
   *
   * Function to abstract throwing internal server exception
   */
  async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      this.loggerService.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Check Entity Existence
   *
   * Checks if a findOne query didn't return null or undefined
   */
  checkEntityExistence<T extends Dictionary>(
    entity: T | null | undefined,
    name: string,
  ): void {
    if (isNull(entity) || isUndefined(entity)) {
      throw new NotFoundException(`${name} entity not found`);
    }
  }

  /**
   * Save Entity
   *
   * Validates, saves and flushes entities into the DB
   */
  async saveEntity<T extends Dictionary>(
    repo: EntityManager,
    entity: T,
    isNew = false,
  ): Promise<void> {
    await this.validateEntity(entity);

    if (isNew) {
      repo.persist(entity);
    }

    await this.throwDuplicateError(repo.flush());
  }

  /**
   * Remove Entity
   *
   * Removes an entities from the DB.
   */
  async removeEntity<T extends Dictionary>(
    repo: EntityManager,
    entity: T,
  ): Promise<void> {
    await this.throwInternalError(repo.removeAndFlush(entity));
  }

  /**
   * Format Name
   *
   * Takes a string trims it and capitalizes every word
   */
  formatName(title: string): string {
    return title
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }

  /**
   * Generate Point Slug
   *
   * Takes a string and generates a slug with dtos as word separators
   */

  generatePointSlug(string: string) {
    return slugify(string, {
      lower: true,
      replacement: '.',
      remove: /['_\.\-]/g,
    });
  }

  generateMessage(message: string): ReturnMessage {
    return { id: v4(), message };
  }
}
