"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Receipt,
  ArrowRight,
  ShoppingBag,
  RotateCcw,
  CreditCard,
  Building2,
  AlertCircle,
} from "lucide-react";
import { axiosInstance } from "@/utils/axiosInstance";

interface PaymentResult {
  orderId: number;
  paymentStatus: "PAID" | "FAILED" | "UNPAID" | "REFUNDED";
  transactionNo: string | null;
  amount: number;
  bankCode: string | null;
  responseCode: string | null;
  message: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        // Chuyển toàn bộ query params nhận từ VNPay sang object
        const params: Record<string, string> = {};
        searchParams.forEach((val, key) => {
          params[key] = val;
        });

        if (!params["vnp_TxnRef"]) {
          setErrorMessage("Không tìm thấy thông tin giao dịch VNPay hợp lệ.");
          setLoading(false);
          return;
        }

        // Gọi Backend API để xác thực chữ ký và cập nhật CSDL (Cách 2)
        const res = await axiosInstance.get("/payments/vnpay-callback", {
          params,
        });

        if (res.data && res.data.data) {
          setResult(res.data.data);
        } else {
          setErrorMessage(res.data?.message || "Không thể xử lý kết quả giao dịch.");
        }
      } catch (err: any) {
        console.error("Lỗi khi xử lý phản hồi từ VNPay:", err);
        const backendMessage =
          err.response?.data?.message ||
          err.message ||
          "Đã có lỗi xảy ra khi xác thực kết quả thanh toán từ VNPay.";
        setErrorMessage(backendMessage);
      } finally {
        setLoading(false);
      }
    };

    processPaymentReturn();
  }, [searchParams]);

  // 1. Giao diện đang xử lý (Loading State)
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Đang xác thực giao dịch VNPay...
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Hệ thống đang kiểm tra chữ ký số và cập nhật đơn hàng của bạn. Vui lòng không đóng trình duyệt.
          </p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Giao diện lỗi kết nối / Lỗi xác thực
  if (errorMessage && !result) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-rose-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Xác thực không thành công
          </h2>
          <p className="text-sm text-rose-600 mb-6 bg-rose-50 p-3 rounded-lg border border-rose-200">
            {errorMessage}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/profile/purchasehistory"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium transition"
            >
              <Receipt className="w-4 h-4" />
              Kiểm tra Lịch sử đơn hàng
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = result?.paymentStatus === "PAID";

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div
          className={`p-8 text-center text-white ${
            isSuccess
              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
              : "bg-gradient-to-br from-rose-500 to-red-600"
          }`}
        >
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-inner">
            {isSuccess ? (
              <CheckCircle2 className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {isSuccess ? "Thanh toán Thành công!" : "Thanh toán Thất bại"}
          </h1>
          <p className="text-sm text-white/90 mt-1 max-w-xs mx-auto">
            {isSuccess
              ? "Đơn hàng của bạn đã được thanh toán và đang chuẩn bị xử lý giao hàng."
              : result?.message || "Giao dịch đã bị hủy hoặc không thể hoàn tất."}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-gray-400" />
                Mã đơn hàng
              </span>
              <span className="font-semibold text-gray-900">
                #{result?.orderId}
              </span>
            </div>

            {result?.transactionNo && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  Mã giao dịch VNPay
                </span>
                <span className="font-mono text-gray-800 text-xs bg-gray-200/70 px-2 py-0.5 rounded">
                  {result.transactionNo}
                </span>
              </div>
            )}

            {result?.bankCode && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Ngân hàng / Cổng
                </span>
                <span className="font-medium text-gray-800">
                  {result.bankCode}
                </span>
              </div>
            )}

            {result?.amount !== undefined && (
              <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-700">Tổng thanh toán</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(result.amount)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {isSuccess ? (
              <>
                <Link
                  href={`/profile/purchasehistory/${result?.orderId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-200 transition"
                >
                  <Receipt className="w-4 h-4" />
                  Xem đơn hàng
                </Link>
                <Link
                  href="/products"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Mua sắm tiếp
                </Link>
              </>
            ) : (
              <>
                {result?.orderId ? (
                  <Link
                    href={`/profile/purchasehistory/${result.orderId}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md shadow-rose-200 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Thử thanh toán lại
                  </Link>
                ) : (
                  <Link
                    href="/cart"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Quay lại giỏ hàng
                  </Link>
                )}
                <Link
                  href="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition"
                >
                  Về trang chủ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <VNPayReturnContent />
    </Suspense>
  );
}
