/**
 * api/user.api.ts
 * Raw HTTP calls for user management and profile endpoints.
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

export interface SavedAddress {
  _id: string;
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface SaveAddressPayload {
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface MyProfileResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    mobileNumber: string;
    email?: string;
    role: string;
    savedAddresses: SavedAddress[];
  };
}

export interface SaveAddressResponse {
  success: boolean;
  data: MyProfileResponse["data"];
}

/* ── Profile endpoints (authenticated user) ─────────────────── */

export async function getMyProfile(): Promise<MyProfileResponse> {
  const res = await apiClient.get<MyProfileResponse>("/users/profile/me");
  return res.data;
}

export async function saveMyAddress(
  payload: SaveAddressPayload
): Promise<SaveAddressResponse> {
  const res = await apiClient.post<SaveAddressResponse>(
    "/users/profile/addresses",
    payload
  );
  return res.data;
}

export async function deleteMyAddress(addressId: string): Promise<SaveAddressResponse> {
  const res = await apiClient.delete<SaveAddressResponse>(
    `/users/profile/addresses/${addressId}`
  );
  return res.data;
}

export async function setDefaultAddress(addressId: string): Promise<SaveAddressResponse> {
  const res = await apiClient.patch<SaveAddressResponse>(
    `/users/profile/addresses/${addressId}/default`
  );
  return res.data;
}

/* ── Admin user management endpoints ────────────────────────── */

export async function getUsers(params: UserListParams = {}): Promise<UserListResponse> {
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

export async function getUserById(id: string): Promise<UserSingleResponse> {
  const res = await apiClient.get<UserSingleResponse>(`/users/${id}`);
  return res.data;
}

export async function createUser(payload: CreateUserPayload): Promise<UserSingleResponse> {
  const res = await apiClient.post<UserSingleResponse>("/users", payload);
  return res.data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<UserSingleResponse> {
  const res = await apiClient.put<UserSingleResponse>(`/users/${id}`, payload);
  return res.data;
}

export async function blockUser(id: string): Promise<BlockUserResponse> {
  const res = await apiClient.patch<BlockUserResponse>(`/users/${id}/block`);
  return res.data;
}

export async function deleteUser(id: string): Promise<DeleteUserResponse> {
  const res = await apiClient.delete<DeleteUserResponse>(`/users/${id}`);
  return res.data;
}
