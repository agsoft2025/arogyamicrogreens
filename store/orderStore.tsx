'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { orderApi, Order, OrderPreviewResponse, Address } from '@/api/order.api';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  preview: OrderPreviewResponse | null;
  loading: boolean;
  error: string | null;
}

type OrderAction =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'SET_PREVIEW'; payload: OrderPreviewResponse | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order };

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  preview: null,
  loading: false,
  error: null,
};

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload };
    case 'SET_PREVIEW':
      return { ...state, preview: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
        currentOrder: state.currentOrder?._id === action.payload._id ? action.payload : state.currentOrder,
      };
    default:
      return state;
  }
}

interface OrderContextType extends OrderState {
  previewOrder: (couponCode?: string) => Promise<void>;
  createPaymentOrder: (data: any) => Promise<any>;
  verifyPayment: (data: any) => Promise<any>;
  createCodOrder: (data: any) => Promise<any>;
  getMyOrders: (page?: number, limit?: number) => Promise<void>;
  getOrderById: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const previewOrder = useCallback(async (couponCode?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const preview = await orderApi.previewOrder(couponCode);
      dispatch({ type: 'SET_PREVIEW', payload: preview });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to preview order' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createPaymentOrder = useCallback(async (data: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await orderApi.createPaymentOrder(data);
      return response;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create payment order' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const verifyPayment = useCallback(async (data: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await orderApi.verifyPayment(data);
      return response;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to verify payment' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createCodOrder = useCallback(async (data: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await orderApi.createCodOrder(data);
      return response;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create COD order' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const getMyOrders = useCallback(async (page: number = 1, limit: number = 10) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await orderApi.getMyOrders(page, limit);
      dispatch({ type: 'SET_ORDERS', payload: response.orders });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch orders' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const getOrderById = useCallback(async (orderId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const order = await orderApi.getOrderById(orderId);
      dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch order' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const cancelOrder = useCallback(async (orderId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      await orderApi.cancelOrder(orderId);
      // Update the order in the list
      dispatch({
        type: 'UPDATE_ORDER',
        payload: { ...state.currentOrder, orderStatus: 'CANCELLED' } as Order,
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to cancel order' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentOrder]);

  const value: OrderContextType = {
    ...state,
    previewOrder,
    createPaymentOrder,
    verifyPayment,
    createCodOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    clearError,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
