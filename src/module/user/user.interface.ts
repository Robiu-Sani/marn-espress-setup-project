import { USER_ROLE } from './user.constent';

export interface userInterface {
  name: string;
  image?: string;
  number?: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  isNewUser?: boolean;
  role:
    | 'admin'
    | 'user'
    | 'manager'
    | 'staff'
    | 'developer'
    | 'super-admin';
  status?: 'in-progress' | 'blocked';
  isDeleted: boolean;
  email?: string;
}

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
