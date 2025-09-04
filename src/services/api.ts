import { API_BASE_URL, API_HEALTH_URL } from '../config/api';

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  location?: string;
  farmSize?: string;
  cropTypes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  farmSize?: string;
  cropTypes?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['x-auth-token'] = token;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(),
    };

    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('API_HEALTH_URL:', API_HEALTH_URL);
    console.log('Current window.location:', typeof window !== 'undefined' ? window.location.href : 'SSR');
    console.log('API Request:', { url, config });

    try {
      const response = await fetch(url, config);
      
      console.log('API Response:', { status: response.status, statusText: response.statusText });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User endpoints
  async getProfile(): Promise<User> {
    return this.request<User>('/users/profile');
  }

  async updateProfile(data: Partial<User>): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Check if server is running
  async healthCheck(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_HEALTH_URL}/`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Server not responding');
    } catch (error) {
      throw new Error('Cannot connect to server');
    }
  }
}

export const apiService = new ApiService();
export default apiService;
