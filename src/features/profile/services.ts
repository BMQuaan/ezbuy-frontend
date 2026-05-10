// src/features/profile/services.ts
import axios from 'axios';
import { Profile } from './types';
import { axiosInstance } from '@/utils/axiosInstance';

const API_BASE = 'http://localhost:8081/api/users';
// const API_BASE_TEST = 'http://localhost:8081/api/';

export const fetchUsers = async () =>{
    const response = await axiosInstance.get(`${API_BASE}/me`)
    console.log("test profile axios instance", response.data)
    return response.data.data;
}


export async function fetchUpdateUsers(profile: Profile, file?: File) {
  const formData = new FormData();

  // append object JSON vào form-data
  formData.append(
    "profile",
    new Blob([JSON.stringify({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      address: profile.address,
    })], { type: "application/json" })
  );

  if (file) {
    formData.append("file", file);
  }

  const res = await axiosInstance.put(`${API_BASE}/me`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
}