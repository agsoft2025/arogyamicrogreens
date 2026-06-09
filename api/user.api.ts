/**
 * api/user.api.ts
 * Raw HTTP calls for user management endpoints.
 */

import apiClient from "./axios";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  DeleteUserResponse,
  BlockUserResponse,
  UserListParams,
  UserListResponse,
  UserSingleResponse,
} from "@/types/user.types";

/**
 * GET /users
 * Paginated, filterable user list.
 */
export async function getUsers(
  params: UserListParams = {}
): Promise<UserListResponse> {
  const query: Record<string, string | number> = {};
  if (params.page   !== undefined) query.page  = params.page;
  if (params.limit  !== undefined) query.limit = params.limit;
  if (params.name)   query.name   = params.name;
  if (params.mobile) query.mobile = params.mobile;
  if (params.email)  query.email  = params.email;
  if (params.status) query.status = params.status;

  const res = await apiClient.get<UserListResponse>("/users", { params: query });
  return res.data;
}

/**
 * GET /users/:id
 */
export async function getUserById(id: string): Promise<UserSingleResponse> {
  const res = await apiClient.get<UserSingleResponse>(`/users/${id}`);
  return res.data;
}

/**
 * POST /users
 * Creates a new user.
 */
export async function createUser(
  payload: CreateUserPayload
): Promise<UserSingleResponse> {
  const res = await apiClient.post<UserSingleResponse>("/users", payload);
  return res.data;
}

/**
 * PUT /users/:id
 * Full update of a user.
 */
export async function updateUser(
  id: string,
  payload: UpdateUserPayload
): Promise<UserSingleResponse> {
  const res = await apiClient.put<UserSingleResponse>(`/users/${id}`, payload);
  return res.data;
}

/**
 * PATCH /users/:id/block
 * Blocks a user.
 */
export async function blockUser(id: string): Promise<BlockUserResponse> {
  const res = await apiClient.patch<BlockUserResponse>(`/users/${id}/block`);
  return res.data;
}

/**
 * DELETE /users/:id
 * Permanently deletes a user.
 */
export async function deleteUser(id: string): Promise<DeleteUserResponse> {
  const res = await apiClient.delete<DeleteUserResponse>(`/users/${id}`);
  return res.data;
}
