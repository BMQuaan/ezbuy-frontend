"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { axiosInstance } from "@/utils/axiosInstance";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderDetail } from "@/features/orders/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export default function ClientOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get(
          `http://localhost:8081/api/orders/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        setOrder(res.data.data);
      } catch (err: any) {
        console.error("Failed to load order detail:", err);
        setError("Unable to load order details!");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrderDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center text-red-500 py-6">
        {error || "Order not found!"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-md rounded-2xl p-8 mt-8">
      {/* 🔙 Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Order Details #{order.id}
      </h1>

      {/* 🧾 Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500">Order Date</p>
          <p className="font-medium">
            {order.orderDate
              ? format(new Date(order.orderDate), "MM/dd/yyyy HH:mm")
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <StatusBadge status={order.status} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Receiver Name</p>
          <p className="font-medium">{order.receiverName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="font-medium">{order.phone}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Shipping Address</p>
          <p className="font-medium">{order.shippingAddress}</p>
        </div>
      </div>

      {/* 🧺 Order Items */}
      <div className="border-t border-gray-200 mt-4 pt-4">
        <h2 className="text-lg font-semibold mb-3">Order Items</h2>
        <div className="divide-y divide-gray-100">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-3"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-800">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 💵 Total */}
      <div className="text-right mt-6 border-t border-gray-200 pt-4">
        <p className="text-lg font-bold text-gray-900">
          Total: {formatCurrency(order.totalAmount || 0)}
        </p>
      </div>
    </div>
  );
}
