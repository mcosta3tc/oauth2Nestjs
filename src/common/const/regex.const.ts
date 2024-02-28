// At least one uppercase letter and a number or special character
export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// Has only letters, numbers, spaces, apostrophes, dots and dashes
export const NAME_REGEX = /(^[\p{L}\d'\.\s\-]*$)/u;

// checks if a string is a valid slug, useful for usernames
export const SLUG_REGEX = /^[a-z\d]+(?:(\.|-|_)[a-z\d]+)*$/;

// Valid bcrypt hashes
export const BCRYPT_HASH = /\$2[abxy]?\$\d{1,2}\$[A-Za-z\d\./]{53}/;
