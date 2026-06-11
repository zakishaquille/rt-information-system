import { publicClient } from "@/api/client";
import type { PublicHouse } from "./types";

export const getPublicHouse = async (uuid: string): Promise<PublicHouse> => {
  const response = await publicClient
    .get(`houses/${uuid}`)
    .json<{ data: PublicHouse }>();
  return response.data;
};
