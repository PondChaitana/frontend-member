// ============================================
// API Helper — Backend Integration Layer
// ============================================
//
// TODO [Backend Developer]:
// 1. Set the backend URL in .env.local:
//    NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
//
// 2. Implement CORS on your Django backend:
//    pip install django-cors-headers
//    Add 'corsheaders' to INSTALLED_APPS
//    Add 'corsheaders.middleware.CorsMiddleware' to MIDDLEWARE
//    Set CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
//
// 3. All API endpoints should return JSON responses
//    matching the types in app/types/user.ts
// ============================================

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * Get stored JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Store JWT token to localStorage
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
}

/**
 * Remove JWT token (logout)
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

/**
 * Store user data to localStorage
 */
export function setUser(user: object): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Get stored user data
 */
export function getUser(): object | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

// ============================================
// API Fetch Helper
// ============================================
// Automatically adds Authorization header if token exists
// Handles JSON parsing and error responses

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;
  
  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string> || {}),
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(rest.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Auto-attach JWT token
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${BACKEND_URL}${endpoint}`;

  const response = await fetch(url, {
    ...rest,
    headers,
  });

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    // Throw error with backend message for the UI to display
    const errorMessage = data.detail || data.message || 'Something went wrong';
    const error = new Error(errorMessage) as Error & { data: typeof data; status: number };
    error.data = data;
    error.status = response.status;
    throw error;
  }

  return data as T;
}

// ============================================
// API ENDPOINTS — Ready for Backend Integration
// ============================================
// Each function below calls one backend endpoint.
// The TODO comments describe the expected API contract.
// ============================================

import type {
  LoginPayload,
  LoginResponse,
  RegisterUserPayload,
  RegisterResponse,
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  ChangePasswordResponse,
  ApiSuccessResponse,
} from '@/app/types/user';

/**
 * Login
 * 
 * TODO [Backend]: POST /api/auth/login
 * Request Body: { email: string, password: string }
 * Response: { access_token: string, refresh_token?: string, user: UserProfile }
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  // --- 🛠️ MOCK LOGIN FOR FRONTEND DEV ---
  // จำลองการ Login ส่งผ่านให้หน้านี้ทำงานได้โดยไม่ต้องรอ Backend
  // เมื่อต่อ API จริง ให้ลบ Block นี้ออก แล้ว Uncomment โค้ดด้านล่าง
  await new Promise(resolve => setTimeout(resolve, 800)); // จำลองดีเลย์เน็ต
  const isAdmin = payload.email.toLowerCase().includes('admin');
  
  const mockData: LoginResponse = {
    access_token: 'mock_jwt_token_12345',
    refresh_token: 'mock_refresh_token_67890',
    user: {
      id: isAdmin ? 'mock-admin-99' : 'mock-user-01',
      username: isAdmin ? 'Admin Tester' : 'Somchai NormalUser',
      email: payload.email,
      role: isAdmin ? 'admin' : 'user', 
      is_active: true,
      phone: '0812345678',
    } as UserProfile
  };
  
  setToken(mockData.access_token);
  if (mockData.refresh_token) {
    localStorage.setItem('refresh_token', mockData.refresh_token);
  }
  setUser(mockData.user);
  return mockData;
  // ----------------------------------------

  /* => โค้ดของจริงสำหรับทีม Backend (Uncomment เมื่อจะเชื่อมต่อ)
  const data = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
  
  // Store token and user data
  setToken(data.access_token);
  if (data.refresh_token) {
    localStorage.setItem('refresh_token', data.refresh_token);
  }
  setUser(data.user);
  
  return data;
  */
}

/**
 * Register User
 * 
 * TODO [Backend]: POST /api/auth/register
 * Request Body: { username: string, email: string, phone: string, password: string }
 * Response: { success: true, user_id: string | number }
 */
export async function registerUser(payload: RegisterUserPayload): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

/**
 * Register Author
 * 
 * TODO [Backend]: POST /api/auth/register-author
 * Content-Type: multipart/form-data
 * Request Body (FormData):
 *   - username: string
 *   - email: string
 *   - phone: string
 *   - password: string
 *   - expertise: string
 *   - id_card: File (image)
 * Response: { success: true, user_id: string | number }
 */
export async function registerAuthor(formData: FormData): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>('/api/auth/register-author', {
    method: 'POST',
    body: formData,
    skipAuth: true,
  });
}

/**
 * Get current user profile
 * 
 * TODO [Backend]: GET /api/profile
 * Headers: Authorization: Bearer <access_token>
 * Response: UserProfile object
 */
export async function getProfile(): Promise<UserProfile> {
  // --- 🛠️ MOCK GET PROFILE FOR FRONTEND DEV ---
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = getUser();
  if (user) {
    return user as UserProfile;
  }
  throw new Error('Unauthorized');
  // ----------------------------------------

  /* => โค้ดของจริงสำหรับทีม Backend (Uncomment เมื่อจะเชื่อมต่อ)
  return apiFetch<UserProfile>('/api/profile', {
    method: 'GET',
  });
  */
}

/**
 * Update user profile
 * 
 * TODO [Backend]: PUT /api/profile
 * Headers: Authorization: Bearer <access_token>
 * Request Body: { email?: string, phone?: string, expertise?: string }
 * Response: { success: true, user: UserProfile }
 */
export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<ApiSuccessResponse & { user: UserProfile }> {
  return apiFetch<ApiSuccessResponse & { user: UserProfile }>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Change password
 * 
 * TODO [Backend]: POST /api/auth/change-password
 * Headers: Authorization: Bearer <access_token>
 * Request Body: { current_password: string, new_password: string, confirm_password: string }
 * Response: { success: true, new_token?: string }
 */
export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const data = await apiFetch<ChangePasswordResponse>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  // If backend returns a new token, update stored token
  if (data.new_token) {
    setToken(data.new_token);
  }
  
  return data;
}

/**
 * Logout
 * 
 * TODO [Backend]: POST /api/auth/logout (optional)
 * Headers: Authorization: Bearer <access_token>
 * This is optional — frontend clears tokens regardless.
 */
export async function logoutUser(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // Logout endpoint is optional; clear local data anyway
  }
  removeToken();
}
