import {Permission, User} from './apiResponseUser';

export interface Group {
  groupId: string;
  name: string;
  permissions: Permission[];
  users: User[];
}

export interface ApiResponseGroup {
  message: string | null;
  error: string | null;
  content: Group[];
}
