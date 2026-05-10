// src/app/admin/page.tsx

import React from 'react';
import { Truck, Percent, Users, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

// Dữ liệu mock cho Dashboard (Bạn có thể tạo mock service sau này)
const mockStats = [
  { 
    title: 'Tổng Doanh thu', 
    value: '750,500,000 VND', 
    icon: DollarSign, 
    trend: '2.5% so với tháng trước', 
    trendType: 'positive' 
  },
  { 
    title: 'Đơn hàng mới', 
    value: '45 đơn', 
    icon: Truck, 
    trend: 'Tăng 8 đơn so với hôm qua', 
    trendType: 'positive' 
  },
  { 
    title: 'Khách hàng mới', 
    value: '120 người', 
    icon: Users, 
    trend: 'Giảm 1.2% so với tuần trước', 
    trendType: 'negative' 
  },
  { 
    title: 'Khuyến mãi đang chạy', 
    value: '3 chương trình', 
    icon: Percent, 
    trend: 'Sắp hết hạn: SALE30', 
    trendType: 'neutral' 
  },
];

const StatCard: React.FC<typeof mockStats[0]> = ({ title, value, icon: Icon, trend, trendType }) => {
  const trendClass = trendType === 'positive' ? 'text-[--color-success]' : 
                     trendType === 'negative' ? 'text-[--color-danger]' : 
                     'text-[--color-secondary-600]';
  const TrendIcon = trendType === 'positive' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-[--color-card] p-6 rounded-xl shadow-md border border-[--color-border]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[--color-secondary-600] uppercase">{title}</h3>
        <Icon className="w-6 h-6 text-[--color-primary-400]" />
      </div>
      <p className="mt-2 text-3xl font-bold text-[--color-foreground]">{value}</p>
      <div className="mt-4 flex items-center text-sm">
        {trendType !== 'neutral' && <TrendIcon className={`w-4 h-4 mr-1 ${trendClass}`} />}
        <span className={trendClass}>{trend}</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-8 text-[--color-foreground]">Tổng quan Dashboard</h2>

      {/* Grid thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Khu vực Biểu đồ/Danh sách nhanh */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Đơn hàng mới nhất (Ví dụ) */}
        <div className="lg:col-span-2 bg-[--color-card] p-6 rounded-xl shadow-md border border-[--color-border]">
          <h3 className="text-lg font-semibold mb-4 text-[--color-foreground]">5 Đơn hàng Gần nhất</h3>
          <p className="text-[--color-secondary]">...</p>
          {/* Ở đây sẽ là một bảng đơn hàng rút gọn */}
        </div>
        
        {/* Hoạt động gần đây (Ví dụ) */}
        <div className="bg-[--color-card] p-6 rounded-xl shadow-md border border-[--color-border]">
          <h3 className="text-lg font-semibold mb-4 text-[--color-foreground]">Hoạt động Admin</h3>
          <ul className="space-y-3 text-sm text-[--color-foreground]">
            <li>- Xác nhận ĐH #20251012</li>
            <li>- Tạo Khuyến mãi VIP50</li>
            <li>- Cập nhật giá iPhone 15</li>
          </ul>
        </div>
      </div>
    </div>
  );
}