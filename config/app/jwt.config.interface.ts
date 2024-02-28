export interface JwtInterface {
  secret: string;
  time: number;
}

export interface AccessJwtTokenInterface {
  publicKey: string;
  privateKey: string;
  time: number;
}

export interface JwtTokensInterfaces {
  access: AccessJwtTokenInterface;
  confirmation: JwtInterface;
  resetPassword: JwtInterface;
  refresh: JwtInterface;
}
