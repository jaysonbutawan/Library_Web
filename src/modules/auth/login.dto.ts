export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  status: string;
}

export interface LoginResponse {
  success:  boolean;
  message?: string;
  data?: {
    token?:       string;
    user?:        any;
    unavailable?: boolean;
  };
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}
