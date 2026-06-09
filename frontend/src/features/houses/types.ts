export const HouseStatus = {
  DIHUNI: "dihuni",
  TIDAK_DIHUNI: "tidak_dihuni",
} as const;

export type HouseStatus = (typeof HouseStatus)[keyof typeof HouseStatus];

export interface House {
  id: number;
  uuid: string;
  code: string;
  address: string;
  status: HouseStatus;
  created_at: string;
  updated_at: string;
}

export interface HouseInput {
  code: string;
  address: string;
  status: HouseStatus;
}
