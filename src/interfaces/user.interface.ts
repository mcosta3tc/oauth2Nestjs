export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
