/**
 * user.types.ts
 * TypeScript types for users — mirrors the backend IUser model
 * and user API request/response shapes.
 */

/* ── Domain ─────────────────────────────────────────────────── */

export type UserRole   = "user" | "admin";
export type UserStatus = "active" | "blocked" | "deleted" | "suspended";

export interface User {
  /** MongoDB _id as string */
  _id: string;
  name: string;
  email?: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

/* ── Query params ────────────────────────────────────────────── */

export interface UserListParams {
  page?: number;
  limit?: number;
  name?: string;
  mobile?: string;
  email?: string;
  status?: UserStatus;
}

/* ── Pagination ──────────────────────────────────────────────── */

export interface UserPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ── API Response shapes ─────────────────────────────────────── */

export interface UserListData {
  items: User[];
  pagination: UserPagination;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: UserListData;
}

export interface UserSingleResponse {
  success: boolean;
  message: string;
  data: User;
}

/* ── Create / Update payloads ────────────────────────────────── */

export interface CreateUserPayload {
  name: string;
  email?: string;
  mobileNumber: string;
  role?: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  mobileNumber?: string;
  role?: UserRole;
  status?: UserStatus;
  isMobileVerified?: boolean;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface BlockUserResponse {
  success: boolean;
  message: string;
}

/* ── Hook state ──────────────────────────────────────────────── */

export interface UseUsersState {
  users: User[];
  pagination: UserPagination | null;
  loading: boolean;
  error: string | null;
}
