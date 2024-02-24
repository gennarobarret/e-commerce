import { UserRole } from './roles.type';

export interface User {
  _id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  countryAddress: string;
  stateAddress: string;
  emailAddress: string;
  phoneNumber?: string;  
  birthday?: Date; 
  role: UserRole;
  groups?: string[];
  authMethod?: string;
  identification?: string;
  additionalInfo?: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWithToken extends User {
  token: string;
}
