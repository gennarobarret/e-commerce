import { Role } from './roles.type';

export interface User {
  email: string;
  role: Role;
}

export interface UserWithToken extends User {
  token: string;
}
