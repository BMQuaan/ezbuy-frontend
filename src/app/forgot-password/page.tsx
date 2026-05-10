"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import { axiosInstance } from "@/utils/axiosInstance";
// import axios from "axios";
import api from "@/lib/api/api";
import { notify } from "@/lib/notification/notistack";
import { axiosInstance } from "@/utils/axiosInstance";

/*
   Flow:
   1️⃣ Nhập email -> /auth/forgot-password
   2️⃣ Nhập OTP -> /auth/verify-otp
   3️⃣ Nhập mật khẩu mới -> /auth/reset-password
*/
export default function ForgotPasswordFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const validateEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

  // ====== STEP 1: Gửi OTP ======
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess("");

    const trimmed = email.trim();
    if (!trimmed) return setError("Please enter your email.");
    if (!validateEmail(trimmed)) return setError("Invalid email address.");

    setLoading(true);
    try {
      const res = await api.post(`/api/auth/forgot-password`, {
        email: trimmed,
      });
      const ok = res.status === 200 || res.data?.status === 200;
      if (ok) {
        setSuccess(res.data?.message || "OTP has been sent to your email.");
        notify("OTP has been sent to your email.", { variant: "success" });
        setStep(2);
      } else {
        setError(res.data?.message || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Unable to connect to the server. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  // ====== STEP 2: Verify OTP ======
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/api/auth/verify-otp`, {
        email: email,
        otp: otp.trim(),
      });
      const ok = res.status === 200 || res.data?.status === 200;
      if (ok) {
        notify("OTP verified. Please set a new password.", {
          variant: "success",
        });
        setSuccess("");
        setError(null);
        setStep(3); // 👉 sang bước nhập mật khẩu mới
      } else {
        setError(res.data?.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Cannot verify OTP right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ====== STEP 3: Đặt mật khẩu mới ======
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess("");

    if (!password.trim() || !confirm.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password.trim() !== confirm.trim()) {
      setError("Password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        email: email,
        otp: otp.trim(),
        newPassword: password.trim(),
      });
      const ok = res.status === 200 || res.data?.status === 200;

      if (ok) {
        notify("Password has been reset. You are login now!", {
          variant: "success",
        });
        setSuccess("Password has been reset.");

        window.location.replace("/");
      } else {
        setError(res.data?.message || "Failed to reset password.");
      }
    } catch {
      setError("Cannot reset password right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ====== UI ======
  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-2xl p-6 md:p-8">
      {/* ===== STEP 1: EMAIL ===== */}
      {step === 1 && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Forgot Password</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your email to receive a one-time password (OTP).
          </p>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                {success}
              </p>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition bg-primary text-white disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : (
                  "Send OTP"
                )}
              </button>

              <a href="/login" className="text-sm text-primary hover:underline">
                Back to Login
              </a>
            </div>
          </form>
        </>
      )}

      {/* ===== STEP 2: OTP ===== */}
      {step === 2 && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Enter OTP</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We’ve sent a one-time password to{" "}
            <span className="font-medium text-foreground break-all">
              {email}
            </span>
            .
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">OTP code</span>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary tracking-[0.4em] text-center text-lg"
                disabled={loading}
              />
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition bg-primary text-white disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                "Verify OTP"
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Didn’t get the code?{" "}
              <button
                type="button"
                onClick={() => {
                  api
                    .post("/api/auth/forgot-password", { email })
                    .then(() =>
                      notify("OTP resent to your email.", {
                        variant: "success",
                      })
                    )
                    .catch(() =>
                      notify("Failed to resend OTP.", { variant: "error" })
                    );
                }}
                className="text-primary hover:underline"
              >
                Resend OTP
              </button>
            </p>

            <p className="text-xs text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setStep(1);
                }}
                className="text-gray-500 hover:underline"
              >
                ← Back to email input
              </button>
            </p>
          </form>
        </>
      )}

      {/* ===== STEP 3: NEW PASSWORD ===== */}
      {step === 3 && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Set New Password</h2>
          <p className="text-sm text-muted-foreground mb-6">
            You are resetting password for{" "}
            <span className="font-medium text-foreground break-all">
              {email}
            </span>
            .
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">New password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Confirm password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition bg-primary text-white disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                "Reset password"
              )}
            </button>

            <p className="text-xs text-center mt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-gray-500 hover:underline"
              >
                ← Back to OTP
              </button>
            </p>
          </form>
        </>
      )}
    </div>
  );
}
