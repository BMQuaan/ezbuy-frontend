// src/features/orders/services.ts
import axios, { AxiosError } from "axios";
import { OrderSummary, OrderDetail, OrderStatus,PaginatedResponse } from "./types";
import { axiosInstance } from "@/utils/axiosInstance";

const API_BASE = "http://localhost:8081/api/orders";

interface OrderSearchParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
  id?: number;
  keyword?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Payload khi tạo đơn hàng mới (Dựa theo OrderDetail)
export interface CreateOrderPayload {
  receiverName: string;
  shippingAddress: string;
  phone: string;
  note?: string;
  paymentMethod?: string;
  items: { productId: number; quantity: number }[]; 
}


  // Hàm xử lý phản hồi API
async function handleResponse<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const res = await promise;
    return res.data.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiResponse<null>>;
      const message = 
        axiosError.response?.data?.message || 
        axiosError.message || 
        "Lỗi API không xác định";
      throw new Error(message);
    }
    
    throw new Error(err instanceof Error ? err.message : "Lỗi không xác định");
  }
}

// Lấy danh sách đơn hàng của người dùng hiện tại
export async function fetchMyOrders(
  page: number = 0,
  size: number = 10,
  status?: string,
  keyword?: string
): Promise<PaginatedResponse<OrderSummary>> {
  const params: OrderSearchParams = { page, size };

  if (status && status !== "ALL") {
    params.status = status as OrderStatus;
  }

  if (keyword && !isNaN(Number(keyword))) {
    params.id = Number(keyword);
  }

  const token = localStorage.getItem("accessToken");

  return handleResponse<PaginatedResponse<OrderSummary>>(
    axiosInstance.get(`${API_BASE}/my-orders`, { params })
  );
}


// Lấy chi tiết một đơn hàng
export async function fetchOrderDetail(orderId: number): Promise<OrderDetail> {
  return handleResponse<OrderDetail>(
    axiosInstance.get(`${API_BASE}/${orderId}`, { withCredentials: true })
  );
}

// Tạo đơn hàng mới
export async function createOrder(data: CreateOrderPayload, idempotencyKey?: string): Promise<OrderSummary> {
  const key = idempotencyKey || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined);
  return handleResponse(
    axiosInstance.post(API_BASE, data, {
      headers: {
        "Content-Type": "application/json",
        ...(key ? { "Idempotency-Key": key } : {}),
      },
      withCredentials: true,
    })
  );
}

// Người dùng hủy đơn hàng của người dùng
export async function cancelMyOrder(orderId: number) {
  const token = localStorage.getItem("accessToken");
  return handleResponse(
    axiosInstance.post(`${API_BASE}/${orderId}/cancel`, null, {
      headers:{
        "Content-Type": "application/json",
        ...(token? {Authorization: `Bearer ${token}`} : {}),
      },
      withCredentials: true,
    })
  );
}

// (Admin) Cập nhật trạng thái đơn hàng
export async function updateOrderStatusByAdmin(
  orderId: number,
  status: OrderStatus
):Promise<OrderDetail> {
  return handleResponse<OrderDetail>(
    axiosInstance.put(
      `${API_BASE}/${orderId}/status`,
      { status },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    )
  );
}

// (Admin) Lấy số lương đơn hàng dùng params
export async function fetchAllOrdersForAdmin(params: URLSearchParams) {
  const token = localStorage.getItem("accessToken");

  const res = await axiosInstance.get(
    `${API_BASE}/admin?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  return res.data.data;
}

// (Admin) Lấy tất cả đơn hàng tạm thời để tính dùng cho data nhỏ
export async function fetchAllOrdersNoPaging() {
  const token = localStorage.getItem("accessToken");

  const res = await axiosInstance.get(`${API_BASE}/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data.content ?? res.data.data;
}



  // (Admin) Tìm kiếm đơn hàng theo keyword
export const searchOrders = async (
  keyword: string = "",
  page: number = 0,
  size: number = 10,
  status?: OrderStatus
): Promise<PaginatedResponse<OrderSummary>> => {
  const params: OrderSearchParams = { keyword, page, size };
  if (status) params.status = status;

  const token = localStorage.getItem("accessToken");

  const response = await axiosInstance.get(`${API_BASE}`, {
    params,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  });

  return response.data.data;
};

