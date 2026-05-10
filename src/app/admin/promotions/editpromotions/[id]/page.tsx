'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { IoMdExit } from "react-icons/io";
import { useRouter, useParams } from "next/navigation";
import { axiosInstance } from '@/utils/axiosInstance';

const MySwal = withReactContent(Swal);

export default function EditPromotion() {
  const router = useRouter();
  const params = useParams(); 
  const promotionId = params?.id;
  const [errors,setErrors] = useState<Record<string,string>>({});

  const [promotion, setPromotion] = useState({
    code: "",
    description: "",
    discountValue: 0,
    startDate: "",
    endDate: "",
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

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  useEffect(() => {
    if (!promotionId) return;

    const token = localStorage.getItem("accessToken");
    axiosInstance.get(`http://localhost:8081/api/promotions/${promotionId}`, 
      {headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      const data = res.data.data;
      setPromotion({
        code: data.code || "",
        description: data.description || "",
        discountValue: data.discountValue || 0,
        startDate: data.startDate?.slice(0, 16) || "",
        endDate: data.endDate?.slice(0, 16) || "",
      });
    })
    .catch(err => {
      console.error("Error fetching promotion:", err.response?.data || err.message);
      MySwal.fire({
        icon: 'error',
        title: 'Failed to load promotion data',
        text: err.response?.data?.message || err.message,
      });
    });
  }, [promotionId]);

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
    if (!validate()) return;
    const token = localStorage.getItem("accessToken");

    const payload = {
      ...promotion,
      startDate: promotion.startDate ? `${promotion.startDate}:00` : null,
      endDate: promotion.endDate ? `${promotion.endDate}:00` : null,
    };

    try {
      const res = await axiosInstance.put(
        `http://localhost:8081/api/promotions/${promotionId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", res.data);
      await MySwal.fire({
        icon: 'success',
        title: 'Promotion updated successfully!',
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/admin/promotions");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating promotion:", error.response?.data || error.message);
        MySwal.fire({
          icon: 'error',
          title: 'Error updating promotion',
          text: error.response?.data?.message || error.message,
        });
      }
    }
  };

  return (
    <div>
      <div className="flex items-center mx-10 relative">
        <div className="text-2xl font-extrabold text-primary-400">Edit Promotion</div>
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
          <div className="mb-2">
            <label className="block font-medium text-gray-700 mb-2">Code</label>
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

          <div>
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

          <div>
            <label className="block font-medium text-gray-700 mb-2">Discount</label>
            <input
              name="discountValue"
              value={promotion.discountValue}
              onChange={handleChange}
              placeholder="Input Discount"
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
            />
            {errors.discountValue && (
              <p className="mt-1 text-sm text-red-600">
                {errors.discountValue}
              </p>
            )}
          </div>

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

          <button
            type="submit"
            className="w-full bg-primary-500 mt-2 cursor-pointer font-semibold border border-primary py-2 px-4 rounded-lg hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
