'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { IoMdExit } from "react-icons/io";
import { useRouter } from "next/navigation";
import { axiosInstance } from '@/utils/axiosInstance';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function AddPromotion() {
  const router = useRouter();
  const [errors,setErrors] = useState<Record<string,string>>({});

  const [promotion, setPromotion] = useState({
    code: "",
    description: "",
    discountValue: 0,
    startDate: "",
    endDate: "",
    // active: false,
  });

  function validate(){
    const e: Record<string,string> = {};

    if(!promotion.code.trim()){
      e.code = "Promotion code can't be empty!"
    }

    if(!promotion.description.trim()){
      e.description = "Description can't be empty!"
    }

    if (promotion.discountValue === null || promotion.discountValue === undefined) {
      e.discountValue = "Discount value can't be empty!";
    } else if (isNaN(Number(promotion.discountValue))) {
      e.discountValue = "Discount value must be a number!";
    } else if (Number(promotion.discountValue) <= 0) {
      e.discountValue = "Discount value must be greater than 0!!";
    }
  
    if (!promotion.startDate.trim()) {
      e.startDate = "Start date can't be empty!";
    }
  
    if (!promotion.endDate.trim()) {
      e.endDate = "End date can't be empty!";
    }

    if (promotion.startDate && promotion.endDate) {
      const start = new Date(promotion.startDate);
      const end = new Date(promotion.endDate);
      const now = new Date();
  
      if (end < now) {
        e.endDate = "End date cannot be in the past!";
      }
  
      if (start >= end) {
        e.startDate = "Start date must be before end date!";
      }
    }
  

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setPromotion(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? (value === "" ? "" : Number(value))
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!validate()){
      return;
    }

    const start = new Date(promotion.startDate);
    const now = new Date();

    if (start > now) {
      await MySwal.fire({
        icon: 'info',
        title: 'Notice',
        text: 'This promotion will start in the future (Upcoming).',
        confirmButtonColor: '#3085d6',
      });
    }

    const token = localStorage.getItem("accessToken");
    const payload = {
      ...promotion,
      // chuẩn hóa ngày giờ: nếu backend yêu cầu ISO string thì dùng toISOString()
      startDate: promotion.startDate ? `${promotion.startDate}:00` : null,
      endDate: promotion.endDate ? `${promotion.endDate}:00` : null,
    };

    console.log("Payload gửi đi:", payload);

    try {
      const res = await axiosInstance.post("http://localhost:8081/api/promotions", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", res.data);
      await MySwal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Promotion created successfully!',
        confirmButtonColor: '#3085d6',
      });
      router.push("/admin/promotions");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
      } else {
        console.error("Unknown error:", error);
      }

      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: '⚠️ Error creating promotion. Check console for details.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div>
      <div className="flex items-center mx-10 relative">
        <div className="text-2xl font-extrabold text-primary-400">Add New Promotion</div>
        <button
          onClick={() => router.back()}
          className="flex items-center absolute right-3 top-1/2 text-2xl font-semibold cursor-pointer"
        >
          <IoMdExit className="text-danger" />
        </button>
      </div>

      <div className="flex justify-center items-center pt-10 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-gray-200"
        >
          {/* Promotion Code */}
          <div className="mb-2">
            <label className="block font-medium text-gray-700 mb-2">Promotion Code</label>
            <input
              name="code"
              value={promotion.code}
              onChange={handleChange}
              placeholder="Input Code"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
            />
            {errors.code && (
            <p className="mt-1 text-sm text-red-600">
              {errors.code}
            </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-2">
            <label className="block font-medium text-gray-700 mb-2">Description</label>
            <input
              name="description"
              value={promotion.description}
              onChange={handleChange}
              placeholder="Input Description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          {/* Discount */}
          <div className="mb-2">
            <label className="block font-medium text-gray-700 mb-2">Discount Value</label>
            <input
              type="number"
              name="discountValue"
              value={promotion.discountValue}
              onChange={handleChange}
              placeholder="Input Discount Value"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
            />
            {errors.discountValue && (
              <p className="mt-1 text-sm text-red-600">
                {errors.discountValue}
              </p>
            )}
          </div>

          {/* Start - End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={promotion.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.startDate}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={promotion.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Active */}
          {/* <div className="flex items-center justify-between mb-6 pt-4">
            <label className="font-medium text-gray-700">Active</label>
            <input
              type="checkbox"
              name="active"
              checked={promotion.active}
              onChange={handleChange}
              className="w-5 h-5 text-primary-500 focus:ring-primary-400 border-gray-300 rounded"
            />
          </div> */}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary-500 cursor-pointer font-semibold border border-primary-400 py-2 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 hover:bg-primary-400 hover:text-white"
          >
            Save Promotion
          </button>
        </form>
      </div>
    </div>
  );
}
