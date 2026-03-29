// ============================================
// Admin Dashboard TypeScript Types
// ============================================
// Types for admin pages — dashboard stats,
// user management, and login frequency.
// Backend developers: implement API responses
// to match these types.
// ============================================

import type { UserRole } from './user';

/**
 * Dashboard summary stats
 * GET /api/admin/dashboard
 */
export interface DashboardStats {
  total_users: number;
  total_authors: number;
  total_admins: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  active_users: number;
}

/**
 * Chart data for user growth over time
 * GET /api/admin/dashboard/chart
 */
export interface ChartDataPoint {
  label: string;        // e.g. "Jan", "Feb", "Mon", "Tue"
  users: number;
  authors: number;
}

/**
 * User item in the admin user list
 * GET /api/admin/users
 */
export interface AdminUserItem {
  id: number | string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  expertise?: string;
  date_joined: string;    // ISO date string
  last_login: string;     // ISO date string
  is_active: boolean;
  login_count: number;
}

/**
 * User list response with pagination
 * GET /api/admin/users?page=1&search=xxx&role=user
 */
export interface AdminUserListResponse {
  users: AdminUserItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Admin update user payload (no password field)
 * PUT /api/admin/users/:id
 */
export interface AdminUpdateUserPayload {
  username?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  expertise?: string;
  is_active?: boolean;
}

/**
 * Login frequency item
 * GET /api/admin/login-frequency
 */
export interface LoginFrequencyItem {
  user_id: number | string;
  username: string;
  email: string;
  role: UserRole;
  login_count: number;
  last_login: string;     // ISO date string
}
