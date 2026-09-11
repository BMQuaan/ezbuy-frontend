"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { fetchUsers } from "@/features/profile/services";
import type { Profile } from "@/features/profile/types";

export default function ProfileCard() {
  const [user, setUser] = useState<Profile | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUsers();
        console.log(data);
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("user");
    const oldUser = stored ? JSON.parse(stored) : {};

    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...oldUser,
        fullName: fullName || oldUser.fullName,
        imageUrl: user.userAvatar ?? oldUser.imageUrl ?? null,
        email: user.email ?? oldUser.email,
      })
    );

    window.dispatchEvent(new Event("auth:changed"));
  }, [user]);

  const handleEditClick = () => {
    router.push("/profile/editprofile");
  };

  const handleChangePassClick = () => {
    router.push("/profile/changepassword");
  };

  const handlePurchaseHistory = () => {
    router.push("/profile/purchasehistory");
  };

  return (
    <div className="bg-card shadow-lg rounded-2xl p-8 w-full max-w-4xl mx-auto border border-border">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-muted">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <Image
            src={user?.userAvatar || "/images/profile/default-avatar.jpg"}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full border-2 border-primary"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-secondary text-sm">EZBuy Member</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 text-foreground">
        <div>
          <p className="font-semibold text-primary">Email</p>
          <p className="bg-muted rounded-lg p-3 mt-1 text-foreground">
            {user?.email}
          </p>
        </div>
        <div>
          <p className="font-semibold text-primary">Phone Number</p>
          <p className="bg-muted rounded-lg p-3 mt-1 text-foreground">
            {user?.phone}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="font-semibold text-primary">Address</p>
          <p className="bg-muted rounded-lg p-3 mt-1 text-foreground">
            {user?.address}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button
          onClick={handleEditClick}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
        >
          Edit Profile
        </button>
        <button
          onClick={handleChangePassClick}
          className="bg-muted text-foreground px-6 py-2 rounded-lg hover:bg-primary-200 transition font-medium"
        >
          Change Password
        </button>
        <button
          onClick={handlePurchaseHistory}
          className="bg-success text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
        >
          Purchase History
        </button>
      </div>
    </div>
  );
}
