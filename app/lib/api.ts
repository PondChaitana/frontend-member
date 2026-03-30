// ============================================
// API Helper — Backend Integration Layer (Fixed + Safe)
// ============================================

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:8000';

/**
 * JWT token helpers
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

/**
 * User helpers
 */
export function setUser(user: object): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): object | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * API Fetch Helper
 */
interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string> || {}),
  };

  if (!(rest.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const response = await fetch(url, {
    ...rest,
    headers,
  });

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.detail || data.message || 'Something went wrong';
    const error = new Error(errorMessage) as Error & { data: typeof data; status: number };
    error.data = data;
    error.status = response.status;
    throw error;
  }

  return data as T;
}

// ============================================
// API Endpoints (Safe + Email Login)
// ============================================

import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  ChangePasswordResponse,
  ApiSuccessResponse,
} from '@/app/types/user';

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: number;
    email: string;
    role: string;
    fullname: string;
  };
}

export async function loginUser(payload: { email: string; password: string }): Promise<LoginResponse> {
  const data = await apiFetch<{
    access: string;
    refresh?: string;
    user?: {
      id: number;
      email: string;
      role: string;
      fullname: string;
    };
  }>('/api/login/', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });

  if (!data.user) {
    throw new Error('Login failed: invalid credentials or user not returned');
  }

  const loginData: LoginResponse = {
    access_token: data.access,
    refresh_token: data.refresh,
    user: data.user,
  };

  setToken(loginData.access_token);
  if (loginData.refresh_token) localStorage.setItem('refresh_token', loginData.refresh_token);
  setUser(loginData.user);

  return loginData;
}

export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/profile', {
    method: 'GET',
  });
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<ApiSuccessResponse & { user: UserProfile }> {
  const data = await apiFetch<ApiSuccessResponse & { user: UserProfile }>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (data.user) setUser(data.user);
  return data;
}

export async function changePassword(payload: { new_password: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/reset-password/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // optional ignore
  }
  removeToken();
}

// ============================================
// Register Endpoints
// ============================================

export interface RegisterPayload {
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  role: 'user' | 'author';
  idcard?: File;
  expertise?: string;
}

// Register user (JSON)
export async function registerUser(payload: RegisterPayload) {
  return apiFetch('/api/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

// Register author (FormData)
export async function registerAuthor(formData: FormData) {
  return apiFetch('/api/register/', {
    method: 'POST',
    body: formData,
    skipAuth: true,
  });
}

export interface AdminUser {
  [x: string]: any;
  id: number;
  username: string;
  email: string;
  phone: string;
  role: 'user' | 'author' | 'admin';
  expertise?: string;
  is_active: boolean;
  date_joined: string;
  last_login: string;
}

export interface AdminUsersResponse {
  results: AdminUser[];
  count: number;
}

export interface UpdateAdminUserPayload {
  username?: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'author' | 'admin';
  expertise?: string;
  is_active?: boolean;
}

// List users (with optional search & role filter)
export async function adminGetUsers(
  query?: { role?: string; fullname?: string; page?: number }
): Promise<AdminUsersResponse> {
  const params = new URLSearchParams(query as Record<string, string>);
  return apiFetch<AdminUsersResponse>(`/api/admin/users/?${params.toString()}`, {
    method: 'GET',
  });
}

// Get single user
export async function adminGetUser(userId: number): Promise<AdminUser> {
  console.log(`Fetching user with ID: ${userId}`);
  return apiFetch<AdminUser>(`/api/admin/users/${userId}/`, {
    method: 'GET',
  });
}

// Update user (PATCH)
export async function adminUpdateUser(
  userId: number,
  payload: Partial<AdminUser>
): Promise<AdminUser> {
  const token = getToken();
  const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/update/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.detail || data.message || 'Failed to update user';
    throw new Error(msg);
  }

  return res.json();
}

// Delete user
export async function adminDeleteUser(userId: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/admin/users/${userId}/delete/`, {
    method: 'DELETE',
  });
}