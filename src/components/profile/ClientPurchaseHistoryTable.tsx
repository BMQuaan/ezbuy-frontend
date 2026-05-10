"use client";

import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { OrderSummary } from "@/features/orders/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { GiCancel  } from "react-icons/gi";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

interface ClientPurchaseHistoryTableProps {
  orders: OrderSummary[];
  onCancel: (id: number) => Promise<void>;
}

const tableHeaders = ["Order ID", "Date", "Total Amount", "Status", "Action"];

export const ClientPurchaseHistoryTable: React.FC<ClientPurchaseHistoryTableProps> = ({ orders,onCancel }) => {
    
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

    <div className="flex">
        <Link
        key="details"
        href={`/profile/purchasehistory/${order.id}`}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-primary hover:bg-primary/10 hover:text-primary-700 transition-all duration-200"
        title="View Order Details"
      >
        <Eye className="w-4 h-4" />
      </Link>
      {order.status=="PENDING" && (<button
        onClick={() => onCancel(order.id)}
        className="text-danger hover:text-primary-400"
        title="Cancel Order"
      >
        <GiCancel/>
      </button>)}
    </div>
    

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
