export const ResidentStatus = {
  TETAP: "tetap",
  KONTRAK: "kontrak",
} as const;

export type ResidentStatus =
  (typeof ResidentStatus)[keyof typeof ResidentStatus];

export interface Resident {
  id: number;
  full_name: string;
  status: ResidentStatus;
  phone_number: string;
  is_married: boolean;
  ktp_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResidentFormData {
  full_name: string;
  status: ResidentStatus;
  phone_number: string;
  is_married: boolean;
  ktp_photo?: File;
}
