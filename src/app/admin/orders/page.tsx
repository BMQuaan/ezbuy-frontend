'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Eye, Loader2, DollarSign, Truck, Clock, XCircle, CheckCircle, PackageCheck } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { fetchAllOrdersForAdmin, fetchAllOrdersNoPaging } from '@/features/orders/services';
import { OrderSummary, OrderStatus } from '@/features/orders/types';
import { format } from 'date-fns';
import { axiosInstance } from '@/utils/axiosInstance';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const OrderStatCard: React.FC<{ icon: React.ElementType; title: string; value: string; color: string }> = ({
  icon: Icon,
  title,
  value,
  color,
}) => (
  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}20`, color }}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold text-gray-600 tracking-wide">{title}</p>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export default function AdminOrderListPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  
  const [dateFrom, setDateFrom] = useState<string>(""); 
  const [dateTo, setDateTo] = useState<string>("");

  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [allOrders, setAllOrders] = useState<OrderSummary[]>([]);




  async function loadOrders() {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      params.append("sort", `orderDate,desc`);
      params.append("sortBy", "id");
      params.append("sortDir", sortDir); 
  
      if (search.trim()) params.append("receiverName", search.trim());
      if (statusFilter) params.append("status", statusFilter);
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
  
      const dataOrder = await fetchAllOrdersForAdmin(params);
      console.log("Data from API:", dataOrder);
  
      if (dataOrder?.content) {
        setOrders(dataOrder.content);
        setTotalPages(dataOrder.totalPages);
      } else if (Array.isArray(dataOrder)) {
        setOrders(dataOrder);
        setTotalPages(1);
      } else {
        console.error("Unexpected data structure:", dataOrder);
        setOrders([]);
        setTotalPages(1);
      }
  
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Không thể tải danh sách đơn hàng!");
      setIsLoading(false);
    }
  }

  useEffect(() => {
  const loadAllOrders = async () => {
    const all = await fetchAllOrdersNoPaging();
    setAllOrders(all);
  };

  loadAllOrders();
}, []);

  
  useEffect(() => {
    loadOrders();
  }, [statusFilter, dateFrom, dateTo,sortDir,page, size]);
  
  useEffect(() => {
    const delay = setTimeout(() => {
      loadOrders();
    }, 300);
  
    return () => clearTimeout(delay);
  }, [search]);
  

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await loadOrders();
  };

  const handleUpdateStatus = async (id: number, newStatus: OrderStatus) => {
    const confirm = await Swal.fire({
      title: `Confirm update`,
      text: `Mark order #${id} as "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel',
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosInstance.put(`/orders/${id}/status`, { status: newStatus });
      Swal.fire('Success', `Order #${id} updated to ${newStatus}`, 'success');
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: newStatus } : o)));
    } catch (err: unknown) {
      console.error('Error updating status:', err);
      
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update order';
        Swal.fire('Error', errorMessage, 'error');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
        Swal.fire('Error', errorMessage, 'error');
      }
    }
  };

  /* Thống kê */
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCount = allOrders.filter(o => o.status === 'PENDING').length;
  const completedCount = allOrders.filter(o => o.status === 'COMPLETED').length;
  const cancelledCount = allOrders.filter(o => o.status === 'CANCELLED').length;


  const tableHeaders = ['Order ID', 'Customer', 'Total Amount', 'Order Date', 'Payment', 'Status', 'Actions'];

  const tableData = orders.map(order => {
    const renderActionButtons = () => {
      switch (order.status) {
        case 'PENDING':
          return (
            <>
              <button
                onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          );
        case 'CONFIRMED':
          return (
            <>
              <button
                onClick={() => handleUpdateStatus(order.id, 'SHIPPING')}
                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition"
              >
                <Truck className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          );
        case 'SHIPPING':
          return (
            <>
              <button
                onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
              >
                <PackageCheck className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          );
        default:
          return null;
      }
    };

    return [
      <span key="id" className="font-mono font-semibold">
        {order.id}
      </span>,
      <div key="cust" className="flex flex-col">
        <span className="font-medium text-ring">{order.receiverName}</span>
        <span className="text-xs text-secondary">{order.userEmail}</span>
      </div>,
      <span key="amount" className="font-bold text-success">{formatCurrency(order.totalAmount)}</span>,
      <span key="date" className="text-gray-800">{format(new Date(order.orderDate), 'MM/dd/yyyy HH:mm')}</span>,
      <span key="payment" className="text-sm text-gray-700">Cash on Delivery</span>,
      <StatusBadge key="status" status={order.status as OrderStatus} />,
      <div key="actions" className="flex items-center gap-2">
        <Link
          href={`/admin/orders/${order.id}`}
          className="text-primary-400 hover:text-primary-700 p-2 rounded-full hover:bg-primary-100 transition"
        >
          <Eye className="w-5 h-5" />
        </Link>
        {renderActionButtons()}
      </div>,
    ];
  });

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-blue-500 pl-3">
        Order Management
      </h2>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <OrderStatCard icon={DollarSign} title="Total Revenue" value={formatCurrency(totalRevenue)} color="#10b981" />
        <OrderStatCard icon={Truck} title="Completed Orders" value={completedCount.toString()} color="#0ea5e9" />
        <OrderStatCard icon={Clock} title="Pending Orders" value={pendingCount.toString()} color="#f59e0b" />
        <OrderStatCard icon={XCircle} title="Cancelled Orders" value={cancelledCount.toString()} color="#ef4444" />
      </div>

      {/* Thanh tìm kiếm & lọc */}
      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 pb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch(); 
            }
          }}
          className="border border-primary-400 p-2 rounded-xl focus:outline-none px-3 w-64"
          placeholder="Search by receiver name..."
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          className="border border-primary-400 p-2 rounded-xl focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPING">Shipping</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button
          type="submit"
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-600 transition"
        >
          <FaSearch />
          <span>Filter</span>
        </button>

        <button
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          className="px-3 py-1 bg-white text-primary-700 rounded hover:bg-primary-200 transition border border-primary-700"
        >
          Sort ID: {sortDir === "asc" ? "asc ↑" : "desc ↓"}
      </button>
      </form>
      

      {/* Hiển thị bảng */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-gray-200 shadow-inner">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600 text-sm">Loading orders...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 bg-red-50 py-4 rounded-lg shadow-md">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 bg-white py-6 rounded-lg shadow-md">No orders found.</div>
      ) : (
        <AdminTable headers={tableHeaders} data={tableData} />
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

    </>
  );
}
