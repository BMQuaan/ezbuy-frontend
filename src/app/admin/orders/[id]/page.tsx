"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Truck,
  XCircle,
  CheckCircle,
  PackageCheck,
} from "lucide-react";
import { format } from "date-fns";
import { axiosInstance } from "@/utils/axiosInstance";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatus,OrderDetail } from "@/features/orders/types";
import { fetchOrderDetail, updateOrderStatusByAdmin } from "@/features/orders/services";
import Swal from "sweetalert2";
import axios from "axios";

/* Định dạng tiền */
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Lấy thông tin chi tiết đơn hàng */
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setIsLoading(true);
        const data = await fetchOrderDetail(Number(id));
        setOrder(data);
        // setOrder(res?.data?.data);
      } catch (err: unknown) {
        console.error("Error loading order:", err);
        setError(err instanceof Error ? err.message : "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  /* ⚙️ Cập nhật trạng thái */
  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    // if (!window.confirm(`Mark order #${id} as "${newStatus}"?`)) return;
    const result = await Swal.fire({
      title: "Confirm action",
      text: `Are you sure you want to mark this order as "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await updateOrderStatusByAdmin(order!.id, newStatus);
      setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Order status updated to ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      if(axios.isAxiosError(err))
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Failed to update order status",
      });
    }
  };

  /* Xử lý trạng thái nút hành động */
  const renderActionButtons = () => {
    if (!order) return null;
    switch (order.status) {
      case "PENDING":
        return (
          <>
            <button
              onClick={() => handleUpdateStatus("CONFIRMED")}
              className="flex items-center gap-1 text-green-600 hover:text-green-800 p-2 px-3 bg-green-100 rounded-lg transition"
            >
              <CheckCircle className="w-4 h-4" /> Confirm
            </button>
            <button
              onClick={() => handleUpdateStatus("CANCELLED")}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 p-2 px-3 bg-red-100 rounded-lg transition"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          </>
        );
      case "CONFIRMED":
        return (
          <>
            <button
              onClick={() => handleUpdateStatus("SHIPPING")}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-2 px-3 bg-blue-100 rounded-lg transition"
            >
              <Truck className="w-4 h-4" /> Shipping
            </button>
            <button
              onClick={() => handleUpdateStatus("CANCELLED")}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 p-2 px-3 bg-red-100 rounded-lg transition"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          </>
        );
      case "SHIPPING":
        return (
          <>
            <button
              onClick={() => handleUpdateStatus("COMPLETED")}
              className="flex items-center gap-1 text-green-600 hover:text-green-800 p-2 px-3 bg-green-100 rounded-lg transition"
            >
              <PackageCheck className="w-4 h-4" /> Complete
            </button>
            <button
              onClick={() => handleUpdateStatus("CANCELLED")}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 p-2 px-3 bg-red-100 rounded-lg transition"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          </>
        );
      default:
        return null; // COMPLETED hoặc CANCELLED
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 bg-red-50 py-4 rounded-lg">
        {error}
      </div>
    );

  if (!order)
    return <div className="text-center text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/admin/orders"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Orders
        </Link>
        <div className="flex gap-2">{renderActionButtons()}</div>
      </div>

      {/* Thông tin chung */}
      <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <StatusBadge status={order.status} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Order Date</p>
          <p className="font-medium">
            {order.orderDate
              ? format(
                  new Date(order.orderDate.replace(" ", "T")),
                  "MM/dd/yyyy HH:mm"
                )
              : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-medium">{order.receiverName}</p>
          <p className="text-sm text-gray-500">{order.userEmail}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Shipping Address</p>
          <p className="font-medium">{order.shippingAddress}</p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <h3 className="text-lg font-semibold mb-2">Order Items</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-right">Quantity</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{item.productName}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                <td className="p-3 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-end mt-6">
        <div className="text-right">
          <p className="text-gray-600">Subtotal:</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}
