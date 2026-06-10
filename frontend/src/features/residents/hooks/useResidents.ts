import { useState, useCallback } from 'react';
import type { Resident, ResidentFormData } from '../types';
import { residentApi } from '../api';

export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await residentApi.getResidents();
      setResidents(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createResident = async (data: ResidentFormData) => {
    try {
      setError(null);
      const response = await residentApi.createResident(data);
      await fetchResidents();
      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create resident');
      }
      throw err;
    }
  };

  const updateResident = async (id: number, data: Partial<ResidentFormData>) => {
    try {
      setError(null);
      const response = await residentApi.updateResident(id, data);
      await fetchResidents();
      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update resident');
      }
      throw err;
    }
  };

  const deleteResident = async (id: number) => {
    try {
      setError(null);
      await residentApi.deleteResident(id);
      await fetchResidents();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete resident');
      }
      throw err;
    }
  };

  return {
    residents,
    loading,
    error,
    fetchResidents,
    createResident,
    updateResident,
    deleteResident,
  };
}
