import { useState, useCallback } from 'react';
import { HTTPError } from 'ky';
import type { Resident, ResidentFormData } from '../types';
import { residentApi } from '../api';
import { toast } from '@/stores/useToastStore';
import { handleApiError } from '@/utils/apiErrorHelper';

export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await residentApi.getResidents();
      setResidents(data);
    } catch (err: unknown) {
      toast.error(await handleApiError(err, 'Failed to fetch residents'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createResident = async (data: ResidentFormData) => {
    try {
      const response = await residentApi.createResident(data);
      toast.success('Resident created successfully');
      await fetchResidents();
      return response.data;
    } catch (err) {
      if (!(err instanceof HTTPError && err.response.status === 422)) {
        toast.error(await handleApiError(err, 'Failed to create resident'));
      }
      throw err;
    }
  };

  const updateResident = async (id: number, data: Partial<ResidentFormData>) => {
    try {
      const response = await residentApi.updateResident(id, data);
      toast.success('Resident updated successfully');
      await fetchResidents();
      return response.data;
    } catch (err) {
      if (!(err instanceof HTTPError && err.response.status === 422)) {
        toast.error(await handleApiError(err, 'Failed to update resident'));
      }
      throw err;
    }
  };

  const deleteResident = async (id: number) => {
    try {
      await residentApi.deleteResident(id);
      toast.success('Resident deleted successfully');
      await fetchResidents();
    } catch (err) {
      if (!(err instanceof HTTPError && err.response.status === 422)) {
        toast.error(await handleApiError(err, 'Failed to delete resident'));
      }
      throw err;
    }
  };

  return {
    residents,
    loading,
    fetchResidents,
    createResident,
    updateResident,
    deleteResident,
  };
}
