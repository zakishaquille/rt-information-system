import type { Payment } from "@/features/payments";
import type { Resident } from "@/features/residents";

export const HouseStatus = {
  DIHUNI: "dihuni",
  TIDAK_DIHUNI: "tidak_dihuni",
} as const;

export type HouseStatus = (typeof HouseStatus)[keyof typeof HouseStatus];

export interface HouseResidentPivot {
  is_pic: boolean;
  moved_in_at: string;
  moved_out_at: string | null;
}

export interface HouseResident extends Resident {
  pivot: HouseResidentPivot;
}

export interface House {
  id: number;
  uuid: string;
  code: string;
  address: string;
  status: HouseStatus;
  created_at: string;
  updated_at: string;
  residents?: HouseResident[];
  payments?: Payment[];
}

export interface HouseInput {
  code: string;
  address: string;
  status: HouseStatus;
}
