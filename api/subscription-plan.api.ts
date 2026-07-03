import apiClient from "./axios";

export type IconType = "star" | "gift" | "none";
export type ButtonStyle = "primary" | "secondary";
export type PlanStatus = "active" | "inactive";

export interface PlanFeature {
  text: string;
  highlight: boolean;
  iconType: IconType;
}

export interface SubscriptionPlan {
  _id: string;
  tier: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  buttonStyle: ButtonStyle;
  badge: string;
  featured: boolean;
  displayOrder: number;
  status: PlanStatus;
  features: PlanFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanPayload {
  tier: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  buttonStyle: ButtonStyle;
  badge?: string;
  featured?: boolean;
  displayOrder?: number;
  status?: PlanStatus;
  features: PlanFeature[];
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>;

export interface PaginatedPlansResponse {
  plans: SubscriptionPlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllPlansParams {
  status?: PlanStatus;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

/** Public: fetch only active plans, sorted by displayOrder */
export async function getActivePlans(): Promise<SubscriptionPlan[]> {
  const res = await apiClient.get<{ success: boolean; data: SubscriptionPlan[] }>(
    "/subscription-plans"
  );
  return res.data.data;
}

/** Admin: fetch all plans with optional filters and pagination */
export async function getAllPlans(
  params?: GetAllPlansParams
): Promise<PaginatedPlansResponse> {
  const res = await apiClient.get<{ success: boolean; data: PaginatedPlansResponse }>(
    "/subscription-plans/admin",
    {
      params: params as Record<string, string | number | boolean | null | undefined>,
    }
  );
  return res.data.data;
}

export async function getPlanById(id: string): Promise<SubscriptionPlan> {
  const res = await apiClient.get<{ success: boolean; data: SubscriptionPlan }>(
    `/subscription-plans/${id}`
  );
  return res.data.data;
}

export async function createPlan(data: CreatePlanPayload): Promise<SubscriptionPlan> {
  const res = await apiClient.post<{ success: boolean; data: SubscriptionPlan }>(
    "/subscription-plans",
    data
  );
  return res.data.data;
}

export async function updatePlan(
  id: string,
  data: UpdatePlanPayload
): Promise<SubscriptionPlan> {
  const res = await apiClient.put<{ success: boolean; data: SubscriptionPlan }>(
    `/subscription-plans/${id}`,
    data
  );
  return res.data.data;
}

export async function deletePlan(id: string): Promise<void> {
  await apiClient.delete(`/subscription-plans/${id}`);
}

export async function updatePlanStatus(
  id: string,
  status: PlanStatus
): Promise<SubscriptionPlan> {
  const res = await apiClient.patch<{ success: boolean; data: SubscriptionPlan }>(
    `/subscription-plans/${id}/status`,
    { status }
  );
  return res.data.data;
}
