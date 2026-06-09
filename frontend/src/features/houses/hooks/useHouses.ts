import { useState, useCallback, useEffect } from "react";
import type { House, HouseInput } from "../types";
import { houseApi } from "../api";

export const useHouses = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await houseApi.list();
      setHouses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch houses";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createHouse = async (data: HouseInput) => {
    try {
      setLoading(true);
      setError(null);
      await houseApi.create(data);
      await fetchHouses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create house";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHouse = async (id: number, data: HouseInput) => {
    try {
      setLoading(true);
      setError(null);
      await houseApi.update(id, data);
      await fetchHouses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update house";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHouse = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await houseApi.delete(id);
      await fetchHouses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete house";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchHouses();
    };
    init();
  }, [fetchHouses]);

  return {
    houses,
    loading,
    error,
    createHouse,
    updateHouse,
    deleteHouse,
    refetch: fetchHouses,
  };
};
