'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Loader2, Calendar, Clock, Trash2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { Promotion } from '@/features/promotions/types';
import { format } from 'date-fns';
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Swal from 'sweetalert2';
import axios from 'axios';
import { axiosInstance } from '@/utils/axiosInstance';


interface PromotionQueryParams {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  size?: number;
  code?: string;
}

export default function PromotionListPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'happening' | 'ended'>('all');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [page,setPage] = useState(0);
  const [size,setSize] = useState(5);
  const [totalPages,setTotalPages] = useState(0);

  // Fetch promotions (no isActive)
  const loadPromotions = async () => {
    setIsLoading(true);
    try {
      const params: PromotionQueryParams = {
        sortBy: 'id',
        sortDir,
        page,
        size,
      };
      if (search.trim()) {
        params.code = search.trim();
      }

      const response = await axiosInstance.get(`http://localhost:8081/api/promotions`, { params });

      const allPromos: Promotion[] = response.data?.data?.content || [];

      // Lọc ngay sau khi lấy dữ liệu từ backend
      const now = new Date();
      const filtered = allPromos.filter((promo) => {
        const now = new Date();
        const start = promo.startDate ? new Date(promo.startDate) : null;
        const end = promo.endDate ? new Date(promo.endDate) : null;
      
        if (filterStatus === 'upcoming') {
          return start && start > now; 
        }
        if (filterStatus === 'happening') {
          return start && end && start <= now && end >= now;
        }
        if (filterStatus === 'ended') {
          return end && end < now;
        }
        return true;
      });
      

      setPromotions(filtered);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error loading promotions:', error);
      Swal.fire('Error', 'Failed to fetch promotions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []); // initial

  useEffect(() => {
    loadPromotions();
  }, [filterStatus, sortDir,page,size]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadPromotions();
  };

  const handleDelete = async (promoId: number, promoCode: string) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete promotion code "${promoCode}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const response = await axiosInstance.delete(`http://localhost:8081/api/promotions/${promoId}`);
      if (response.status === 200 || response.status === 204) {
        Swal.fire('Deleted!', 'Promotion deleted successfully.', 'success');
        setPromotions((prev) => prev.filter((p) => p.id !== promoId));
      } else {
        Swal.fire('Failed!', 'Failed to delete promotion.', 'error');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting promotion:", error.response?.data || error.message);
      } else {
        console.error("Unknown error deleting promotion:", error);
      }
      Swal.fire('Error!', 'An error occurred while deleting promotion.', 'error');
    }
  };

  const tableHeaders = ['Code', 'Description', 'Value', 'Timeframe', 'Status', 'Actions'];
  const tableData = promotions.map((promo) => {
    // const endDate = promo.endDate ? new Date(promo.endDate) : null;
    // const statusText = endDate && endDate < new Date() ? 'Ended' : 'Happening';
    // const statusColor = endDate && endDate < new Date() ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';

    const now = new Date();
    const startDate = promo.startDate ? new Date(promo.startDate) : null;
    const endDate = promo.endDate ? new Date(promo.endDate) : null;

    let statusText = 'Unknown';
    let statusColor = 'bg-gray-100 text-gray-600';

    if (startDate && startDate > now) {
      statusText = 'Upcoming';
      statusColor = 'bg-blue-100 text-blue-600';
    } else if (startDate && endDate && startDate <= now && endDate >= now) {
      statusText = 'Happening';
      statusColor = 'bg-green-100 text-green-600';
    } else if (endDate && endDate < now) {
      statusText = 'Ended';
      statusColor = 'bg-red-100 text-red-600';
    }

    return [
      <span className="font-mono text-primary font-extrabold">{promo.code || 'Auto'}</span>,
      <span className="text-foreground break-words whitespace-normal max-w-[300px]">{promo.description}</span>,
      <span className="font-bold text-success">{promo.discountValue}%</span>,
      <div className="flex flex-col text-sm space-y-1">
        <span className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Start: {promo.startDate ? format(promo.startDate, 'MM/dd/yyyy') : 'N/A'}
        </span>
        <span className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          End: {promo.endDate ? format(promo.endDate, 'MM/dd/yyyy') : 'N/A'}
        </span>
      </div>,
      <div className="p-1">
        <span className={`rounded-lg font-semibold ${statusColor}`}>{statusText}</span>
      </div>,
      <div className="flex space-x-2">
        <Link
          href={`/admin/promotions/editpromotions/${promo.id}`}
          className="text-primary hover:text-primary-700 p-1 rounded-full hover:bg-primary-200"
          title="Edit"
        >
          <Edit className="w-5 h-5" />
        </Link>
        <button
          onClick={() => handleDelete(promo.id, promo.code || `#${promo.id}`)}
          className="hover:text-danger-700 p-1 rounded-full hover:bg-danger/5"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>,
    ];
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4 flex-wrap gap-2">
        <h2 className="text-3xl font-extrabold text-primary">Promotion Management</h2>

        {/* Search */}
      
        <button
          onClick={() => router.push("/admin/promotions/addpromotions")}
          className="flex items-center border border-primary space-x-2 px-6 py-2.5 text-primary-400 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Promotion</span>
        </button>
      </div>

      <div className='flex mb-3'>
        <form onSubmit={handleSearch} className="flex justify-center items-center  mr-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-r-0 border-primary-400 p-1 rounded-l-xl focus:outline-none"
            placeholder="Search by code..."
          />
          <button
            type="submit"
            className="border border-l-0 border-primary-400 text-primary-400 p-2 rounded-r-xl hover:bg-primary-50"
          >
            <FaSearch />
          </button>
        </form>

        {/* Filter by status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'upcoming' | 'happening' | 'ended')}
          className="border border-primary-400 rounded px-2 py-1 mr-1"
          title="Filter Promotions by Status"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="happening">Happening</option>
          <option value="ended">Ended</option>
        </select>


        {/* Sort asc/desc */}
        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}
          className="border border-primary-400 rounded px-2 py-1"
          title="Sort by ID"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48 bg-[--color-card] rounded-lg border border-[--color-border]">
          <Loader2 className="w-6 h-6 animate-spin text-[--color-primary] mr-2" />
          <span className="text-[--color-secondary-600]">Loading promotions...</span>
        </div>
      ) : (
        <AdminTable headers={tableHeaders} data={tableData} />
      )}

      {/* phân trang  */}
      {promotions.length > 0 && (
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
