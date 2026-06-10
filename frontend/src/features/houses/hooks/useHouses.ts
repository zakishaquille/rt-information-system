import { useState, useCallback } from "react";
import type { House, HouseInput } from "../types";
import { houseApi } from "../api";
import { toast } from "@/stores/useToastStore";
import { handleApiError } from "@/utils/apiErrorHelper";

export const useHouses = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHouses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await houseApi.list();
      setHouses(data);
    } catch (err) {
      toast.error(await handleApiError(err, "Failed to fetch houses"));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHouseDetails = useCallback(async (id: number) => {
    try {
      setLoading(true);
      return await houseApi.get(id);
    } catch (err) {
      toast.error(await handleApiError(err, "Failed to fetch house details"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createHouse = async (data: HouseInput) => {
    try {
      setLoading(true);
      await houseApi.create(data);
      toast.success("House created successfully");
      await fetchHouses();
    } catch (err) {
      toast.error(await handleApiError(err, "Failed to create house"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHouse = async (id: number, data: HouseInput) => {
    try {
      setLoading(true);
      await houseApi.update(id, data);
      toast.success("House updated successfully");
      await fetchHouses();
    } catch (err) {
      toast.error(await handleApiError(err, "Failed to update house"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHouse = async (id: number) => {
    try {
      setLoading(true);
      await houseApi.delete(id);
      toast.success("House deleted successfully");
      await fetchHouses();
    } catch (err) {
      toast.error(await handleApiError(err, "Failed to delete house"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignResident = async (
    houseId: number,
    residentId: number,
    isPic: boolean,
  ) => {
    try {
      setLoading(true);
      await houseApi.assignResident(houseId, residentId, isPic);
      toast.success("Resident assigned successfully");
      await fetchHouses();
    } catch (err) {
      toast.error(await handleApiError(err, "Failed to assign resident"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unassignResident = async (houseId: number, residentId: number) => {
    try {
      setLoading(true);
      await houseApi.unassignResident(houseId, residentId);
      toast.success("Resident unassigned successfully");
      await fetchHouses();
    } catch (err) {
      toast.error(await handleApiError(err, "Failed to unassign resident"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    houses,
    loading,
    fetchHouses,
    fetchHouseDetails,
    createHouse,
    updateHouse,
    deleteHouse,
    assignResident,
    unassignResident,
  };
};
