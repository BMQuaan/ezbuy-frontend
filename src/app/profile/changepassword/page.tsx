"use client";

import { useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "New passwords do not match!",
      });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("http://localhost:8081/api/users/change-password", {
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      Swal.fire({
                icon: "success",
                title: "Success",
                text: "Password updated successfully!",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
            router.push("/profile"); 
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      const msg =
      error.response?.data?.message || "Failed to change password. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card border border-border shadow-lg rounded-2xl p-8 mt-8">
      <h1 className="text-2xl font-semibold text-primary mb-6 text-center">
        Change Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
