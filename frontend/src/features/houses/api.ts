import { apiClient } from "@/api/client";
import type { House, HouseInput } from "./types";

export const houseApi = {
  list: async (): Promise<House[]> => {
    const response = await apiClient.get("houses").json<{ data: House[] }>();
    return response.data;
  },

  create: async (data: HouseInput): Promise<House> => {
    const response = await apiClient.post("houses", { json: data }).json<{ data: House }>();
    return response.data;
  },

  update: async (id: number, data: HouseInput): Promise<House> => {
    const response = await apiClient.put(`houses/${id}`, { json: data }).json<{ data: House }>();
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`houses/${id}`);
  },
};
