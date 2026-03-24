export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  status: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}