export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Session {
  user: User;
  expiresAt: string | Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}