// ============================================
// User & Auth TypeScript Types
// ============================================
// These types define the data structures exchanged
// between the frontend and backend API.
// Backend developers: implement your API responses
// to match these types for seamless integration.
// ============================================

export type UserRole = 'user' | 'author' | 'admin';

/**
 * Profile data returned from the backend
 * GET /api/profile
 */
export interface UserProfile {
  id: number | string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  expertise?: string;        // Only for authors
  id_card_url?: string;       // Only for authors — URL to uploaded ID card
  date_joined?: string;       // ISO date string
  last_login?: string;        // ISO date string
}

/**
 * Payload for user registration
 * POST /api/auth/register
 */
export interface RegisterUserPayload {
  username: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * Payload for author registration (sent as FormData, not JSON)
 * POST /api/auth/register-author
 */
export interface RegisterAuthorPayload {
  username: string;
  email: string;
  phone: string;
  password: string;
  expertise: string;
  id_card: File;              // The uploaded ID card image
}

/**
 * Login request body
 * POST /api/auth/login
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Login response from backend
 * POST /api/auth/login → Response
 */
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: UserProfile;
}

/**
 * Generic API success response
 */
export interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}

/**
 * Registration response
 * POST /api/auth/register → Response
 * POST /api/auth/register-author → Response
 */
export interface RegisterResponse extends ApiSuccessResponse {
  user_id?: string | number;
}

/**
 * Update profile request
 * PUT /api/profile
 */
export interface UpdateProfilePayload {
  email?: string;
  phone?: string;
  expertise?: string;
}

/**
 * Change password request
 * POST /api/auth/change-password
 */
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Change password response
 * POST /api/auth/change-password → Response
 */
export interface ChangePasswordResponse extends ApiSuccessResponse {
  new_token?: string;          // New JWT token after password change
}

/**
 * API Error response from backend
 */
export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
