"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { CheckCircle } from "lucide-react";
import { notify } from "@/lib/notification/notistack";

type ApiRegisterResponse = {
  status: number;
  message: string;
  data?: {
    accessToken: string;
    fullName: string;
    imageUrl: string | null;
    role: "CUSTOMER" | "ADMIN" | string;
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect_url") || "/";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate đơn giản
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            confirmPassword: form.password,
          }),
        }
      );

      const data: ApiRegisterResponse = await res.json();

      if (!res.ok || data.status !== 200 || !data.data?.accessToken) {
        setError(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          fullName: data.data.fullName,
          imageUrl: data.data.imageUrl,
          role: data.data.role,
          email: form.email,
        })
      );
      window.dispatchEvent(new Event("auth:changed"));
      // setShowSuccess(true);
      notify(`Registration Successful!`, {variant: "success"})
      router.replace("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      notify(`Something went wrong. Please try again.`, {variant: "error"})
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-6 flex flex-col items-center text-center text-2xl font-bold text-primary">
          <div className="relative w-17 h-17">
            <Image
              src="/images/logo/ezbuy_logo.png"
              alt="EZBuy Logo"
              fill
              sizes="56px"
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
            />
          </div>

          {/* Last name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-gray-900 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-gray-900 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 "
              >
                {showConfirmPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-700 transition cursor-pointer disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
      {/* {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full animate-fade-in">
            <CheckCircle className="text-green-500 w-14 h-14 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome aboard 🎉 Your account has been created.
            </p>
            <button
              onClick={() => router.replace(redirect)}
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-700 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
