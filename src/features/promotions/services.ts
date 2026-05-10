// src/features/promotions/services.ts
import axios from 'axios';
import { Promotion } from './types';

const API_BASE = 'http://localhost:8081/api/promotions';

// Lấy tất cả khuyến mãi
export const fetchPromotions = async (code?: string): Promise<Promotion[]> => {
    const url = code? `${API_BASE}?code=${encodeURIComponent(code)}` : API_BASE;
    const response = await axios.get(url);
    // Dữ liệu backend trả về nằm trong response.data.data.content
    return response.data.data.content;
};

// Lấy chi tiết 1 khuyến mãi theo ID
export const fetchPromotionById = async (id: number): Promise<Promotion | undefined> => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data.data;
};

export const savePromotion = async (data: Promotion) => {
    if (data.id) {
        const response = await axios.put(`${API_BASE}/${data.id}`, data);
        return response.data;
    } else {
        const response = await axios.post(API_BASE, data);
        return response.data;
    }
};

export const deletePromotion = async (id: number) => {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
};
