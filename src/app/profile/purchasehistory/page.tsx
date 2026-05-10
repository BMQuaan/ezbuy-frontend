"use client";

import React, { useEffect, useState } from "react";
import { ClientPurchaseHistoryTable } from "@/components/profile/ClientPurchaseHistoryTable";
import { cancelMyOrder, fetchMyOrders } from "@/features/orders/services";
import { OrderSummary } from "@/features/orders/types";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function PurchaseHistoryPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page,setPage] = useState(0);
  const [size,setSize] = useState(5);
  const [totalPages,setTotalPages] = useState(0);


  const loadOrders = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await fetchMyOrders(
      page,
      size,
      statusFilter,
      searchTerm
    );

    setOrders(response.content);
    setTotalPages(response.totalPages);
  } catch (err) {
    setError("Unable to load purchase history.");
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  setPage(0);
}, [statusFilter, searchTerm]);


  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchTerm,page,size]);

  const handleCancel = async (id: number) => {
    const confirmCancel = await Swal.fire({
      title: `Cancel #${id}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirmCancel.isConfirmed) return;

    try {
      await cancelMyOrder(id);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "CANCELLED" } : o))
      );

      Swal.fire({
        icon: "success",
        title: "Cancel Success!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error Cancel",
        text: err.message || "An error has occurred, please try again later!",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-card border border-border shadow-lg rounded-2xl p-8 mt-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Purchase History
      </h1>

      {/* 🔍 Bộ lọc & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            State:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">confirmed</option>
            <option value="SHIPPING">Shipping</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Canceled</option>
          </select>
        </div>

        <div className="flex-1">
          <input
            type="number"
            placeholder="Search order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* 📦 Nội dung */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
          <span className="text-secondary-600">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-medium">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted-foreground font-medium">
          Not found my order request 
        </div>
      ) : (
        <ClientPurchaseHistoryTable orders={orders} onCancel={handleCancel} />
      )}

      {/* phân trang  */}
      {orders.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            ← Prev
          </button>

          <span className="text-gray-700">
            Page {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page + 1 >= totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
    
  );
}
