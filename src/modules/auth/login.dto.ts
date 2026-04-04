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
     user: {
      id: number;
      student_id: string;
      full_name: string;
      email: string;
      department: string;
      status: string;
      registered_at: string;
    };
    unavailable?: boolean;
  };
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}
