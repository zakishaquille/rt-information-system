import { apiClient } from "@/api/client";
import type { Resident, ResidentFormData } from './types';

export const residentApi = {
  getResidents: () => 
    apiClient.get('residents').json<{data: Resident[]}>().then(res => res.data),

  getResident: (id: number) => 
    apiClient.get(`residents/${id}`).json<{data: Resident}>().then(res => res.data),

  createResident: (data: ResidentFormData) => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('status', data.status);
    formData.append('phone_number', data.phone_number);
    formData.append('is_married', data.is_married ? '1' : '0');
    
    if (data.ktp_photo) {
      formData.append('ktp_photo', data.ktp_photo);
    }

    return apiClient.post('residents', { body: formData }).json<{ data: Resident }>();
  },

  updateResident: (id: number, data: Partial<ResidentFormData>) => {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel spoofing for multipart PUT
    
    if (data.full_name) formData.append('full_name', data.full_name);
    if (data.status) formData.append('status', data.status);
    if (data.phone_number) formData.append('phone_number', data.phone_number);
    if (data.is_married !== undefined) formData.append('is_married', data.is_married ? '1' : '0');
    
    if (data.ktp_photo) {
      formData.append('ktp_photo', data.ktp_photo);
    }

    return apiClient.post(`residents/${id}`, { body: formData }).json<{ data: Resident }>();
  },

  deleteResident: (id: number) => 
    apiClient.delete(`residents/${id}`).json(),
};
