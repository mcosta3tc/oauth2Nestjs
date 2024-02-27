export interface BaseJwt {
  secret: string;
  time: number;
}

export interface AccessJwtToken {
  publicKey: string;
  privateKey: string;
  time: number;
}

export interface JwtToken {
  access: AccessJwtToken;
  confirmation: BaseJwt;
  resetPassword: BaseJwt;
  refresh: BaseJwt;
}
