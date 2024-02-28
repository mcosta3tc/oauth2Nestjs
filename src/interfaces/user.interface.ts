import { CredentialsInterface } from '@interfaces/credentials.interface';

export interface UserInterface {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  credentials: CredentialsInterface;
}
