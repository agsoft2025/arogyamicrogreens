import api from './axios';

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderPreviewResponse {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  couponCode?: string;
  couponDiscount?: number;
}

export interface CreatePaymentOrderRequest {
  paymentMethod: 'RAZORPAY' | 'COD';
  shippingAddress: Address;
  billingAddress: Address;
  couponCode?: string;
  notes?: string;
}

export interface CreatePaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
  orderName: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    orderId: string;
  };
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderNumber: string;
  message: string;
}

export interface CreateCodOrderRequest {
  shippingAddress: Address;
  billingAddress: Address;
  couponCode?: string;
  notes?: string;
}

export interface CreateCodOrderResponse {
  success: boolean;
  orderNumber: string;
  message: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  salePrice?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: 'RAZORPAY' | 'COD';
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: Address;
  billingAddress: Address;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paymentTransaction?: any;
  statusHistory?: any[];
}

export interface MyOrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const orderApi = {
  // Preview order
  previewOrder: async (couponCode?: string): Promise<OrderPreviewResponse> => {
    const response = await api.post<{ success: boolean; data: OrderPreviewResponse }>(
      '/orders/preview',
      { couponCode }
    );
    return response.data.data;
  },

  // Create payment order (Razorpay)
  createPaymentOrder: async (
    data: CreatePaymentOrderRequest
  ): Promise<CreatePaymentOrderResponse> => {
    const response = await api.post<{ success: boolean; data: CreatePaymentOrderResponse }>(
      '/orders/create-payment-order',
      data
    );
    return response.data.data;
  },

  // Verify payment
  verifyPayment: async (data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
    const response = await api.post<{ success: boolean; data: VerifyPaymentResponse }>(
      '/orders/verify-payment',
      data
    );
    return response.data.data;
  },

  // Create COD order
  createCodOrder: async (data: CreateCodOrderRequest): Promise<CreateCodOrderResponse> => {
    const response = await api.post<{ success: boolean; data: CreateCodOrderResponse }>(
      '/orders/create-cod-order',
      data
    );
    return response.data.data;
  },

  // Get my orders
  getMyOrders: async (page: number = 1, limit: number = 10): Promise<MyOrdersResponse> => {
    const response = await api.get<{ success: boolean; data: MyOrdersResponse }>(
      `/orders/my-orders?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get<{ success: boolean; data: Order }>(
      `/orders/${orderId}`
    );
    return response.data.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<{ success: boolean; data: { success: boolean; message: string } }>(
      `/orders/cancel/${orderId}`
    );
    return response.data.data;
  },
};
