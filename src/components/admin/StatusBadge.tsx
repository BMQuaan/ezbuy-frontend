// src/components/admin/StatusBadge.tsx

import React from 'react';
// Định nghĩa Status type ở đây hoặc import từ features/orders/types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

const statusMap: Record<OrderStatus, { text: string; class: string }> = {
    PENDING: { text: 'pending', class: 'bg-warning/10' },
    CONFIRMED: { text: 'confirmed', class: 'bg-primary-200' },
    SHIPPING: { text: 'shipping', class: 'bg-primary-200' },
    COMPLETED: { text: 'completed', class: 'bg-success' },
    CANCELLED: { text: 'cancelled', class: 'bg-danger/10' },
};

export const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const badge = statusMap[status] || { text: 'Không rõ', class: 'bg-[--color-muted] text-[--color-secondary-600] border-[--color-secondary]' };
  
    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${badge.class}`}
      >
        {badge.text}
      </span>
    );
  };
  