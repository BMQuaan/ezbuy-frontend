import React, { useState } from "react";
import Link from "next/link";
import { Eye, CreditCard, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { OrderSummary } from "@/features/orders/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { GiCancel } from "react-icons/gi";
import { axiosInstance } from "@/utils/axiosInstance";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

interface ClientPurchaseHistoryTableProps {
  orders: OrderSummary[];
  onCancel: (id: number) => Promise<void>;
}

const tableHeaders = ["Order ID", "Date", "Total Amount", "Status", "Payment", "Action"];

export const ClientPurchaseHistoryTable: React.FC<ClientPurchaseHistoryTableProps> = ({ orders, onCancel }) => {
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);

  const handlePayNow = async (orderId: number) => {
    try {
      setPayingOrderId(orderId);
      const res = await axiosInstance.get(`/orders/${orderId}/payment-url`);
      const paymentUrl = res.data?.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Không thể lấy liên kết thanh toán. Vui lòng thử lại sau.");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể lấy link thanh toán. Vui lòng thử lại sau.");
    } finally {
      setPayingOrderId(null);
    }
  };

  const tableData = orders.map((order) => [
    <span key="id" className="font-mono text-primary font-bold">
      #{order.id}
    </span>,

    <span key="date" className="text-muted-foreground font-medium">
      {order.orderDate ? format(new Date(order.orderDate), "MM/dd/yyyy HH:mm") : "—"}
    </span>,

    <span key="total" className="font-extrabold text-green-600">
      {formatCurrency(order.totalAmount || 0)}
    </span>,

    <StatusBadge key="status" status={order.status} />,

    <span
      key="payment"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        order.paymentStatus === "PAID"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {order.paymentStatus || "UNPAID"}
    </span>,

    <div key="actions" className="flex items-center gap-1">
      <Link
        href={`/profile/purchasehistory/${order.id}`}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-primary hover:bg-primary/10 hover:text-primary-700 transition-all duration-200"
        title="View Order Details"
      >
        <Eye className="w-4 h-4" />
      </Link>

      {order.status === "PENDING" && order.paymentStatus !== "PAID" && (
        <button
          onClick={() => handlePayNow(order.id)}
          disabled={payingOrderId === order.id}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
          title="Thanh toán ngay qua VNPay"
        >
          {payingOrderId === order.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
        </button>
      )}

      {order.status === "PENDING" && (
        <button
          onClick={() => onCancel(order.id)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-danger hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          title="Cancel Order"
        >
          <GiCancel className="w-4 h-4" />
        </button>
      )}
    </div>,
  ]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border shadow-lg">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-primary/10">
          <tr>
            {tableHeaders.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-primary"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {tableData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-background" : "bg-muted/40"
              } hover:bg-primary/5 transition-all duration-300`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="p-6 text-center text-muted-foreground bg-background rounded-b-2xl">
          No completed orders found.
        </div>
      )}
    </div>
  );
};
