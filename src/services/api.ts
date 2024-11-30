import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

// Ensure API URL has a default fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://api.gcms.live';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // For demo purposes, simulate successful login
    // In production, this would make a real API call
    const mockResponse: AuthResponse = {
      user: {
        id: '1',
        email: credentials.email,
        name: 'Demo User',
        company: 'Demo Company',
        role: 'user'
      },
      token: 'mock-jwt-token'
    };
    
    return mockResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    // For demo purposes, simulate successful registration
    // In production, this would make a real API call
    const mockResponse: AuthResponse = {
      user: {
        id: '1',
        email: data.email,
        name: data.name,
        company: data.company,
        role: 'user'
      },
      token: 'mock-jwt-token'
    };
    
    return mockResponse;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed');
  }
}

export async function validateToken(token: string): Promise<boolean> {
  // For demo purposes, always return true
  // In production, this would validate with your backend
  return true;
}