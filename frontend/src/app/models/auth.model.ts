export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest extends LoginRequest {
  email: string;
}

export interface RegisterResponse {
  message?: string;
}