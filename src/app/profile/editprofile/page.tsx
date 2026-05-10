"use client";

import { Profile } from "@/features/profile/types";
import { useEffect, useState } from "react";
import { fetchUpdateUsers,fetchUsers } from "@/features/profile/services";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<Profile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    userAvatar: "",
  });
  const [errors,setErrors] = useState<Record<string,string>>({});
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(){
    const e: Record<string,string> = {};

    const phone = form.phone?.trim() || "";
    const address = form.address?.trim() || "";

    if(!form.firstName.trim()){
      e.firstName = "First name can't be empty!"
    }
    if(!form.lastName.trim()){
      e.lastName = "Last name can't be empty!"
    }
    if(!form.email.trim()){
      e.email = "Email can't be empty!"
    }else{
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        e.email = "Invalid email format!";
      }
    }
    if(!phone){
      e.phone = "Number phone can't be empty!"
    }else if(form.phone.replace(/\D/g,"").length < 9){
      e.phone="Invalid phone"
    }else if(!/^\d+$/.test(form.phone)){
      e.phone = "Phone number must contain digits only!"
    }

    if(!address){
      e.address = "Email can't be empty!"
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUsers();
        setForm(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

    // 📌 Gửi cập nhật hồ sơ
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!validate()){
        return;
      }
      setLoading(true);
      try {
        const updated = await fetchUpdateUsers(form, file || undefined);
        setForm(updated);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
            router.push("/profile"); 
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error updating profile!",
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-2xl mx-auto bg-card border border-border shadow-lg rounded-2xl p-8 mt-8">
      <h1 className="text-2xl font-medium text-primary mb-6 text-center">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col items-center">
        <Image
          src={file ? URL.createObjectURL(file) : form.userAvatar || "/images/profile/default-avatar.jpg"}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full border-2 border-primary mb-2"
        />
        
        <label
          htmlFor="avatar"
          className="cursor-pointer rounded text-white text-underline font-medium bg-primary-400 p-2 hover:bg-primary-200"
        >
          Change Avatar
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>


        <div>
          <label className="block text-sm font-medium text-secondary mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName || ""}
            onChange={handleChange}
            className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName || ""}
            onChange={handleChange}
            className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
          />
          {errors.lastName &&(
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName}
              </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Email</label>
          <input
            disabled
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
            
          />
          {errors.email &&(
              <p className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form?.phone || ""}
            onChange={handleChange}
            className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
          />
          {errors.phone &&(
              <p className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
