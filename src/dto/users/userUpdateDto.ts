import { IsString, Length, Matches, ValidateIf } from 'class-validator';
import { SLUG_REGEX } from '@common/const/regex.const';
import { UsersExceptionsEnum } from '@users/users.const';
import { isNull, isUndefined } from '@common/utils/validation.utils';

export abstract class UserUpdateDto {
  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, { message: UsersExceptionsEnum.USERNAME_SLUG })
  @ValidateIf(
    (object: UserUpdateDto) =>
      !isUndefined(object.username) ||
      isUndefined(object.name) ||
      !isNull(object.name),
  )
  username?: string;

  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, {
    message: UsersExceptionsEnum.NAME_SPECIALS_CHARACTERS,
  })
  @ValidateIf(
    (object: UserUpdateDto) =>
      !isUndefined(object.username) ||
      isUndefined(object.name) ||
      !isNull(object.name),
  )
  name?: string;
}
