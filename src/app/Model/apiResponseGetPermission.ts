export interface ApiResponseGetPermission {
  message: string;
  error: string;
  content: UserPermission[];
}

export interface UserPermission {
  id: string;
  path: string;
  type: string;
}
