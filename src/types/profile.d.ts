import { Gender, Religion } from "@prisma/client";

export type Profile = {
  id: string;
  code: string;
  name: string;
  picture: string | null;
  birthdate: Date;
  religion: Religion;
  gender: Gender;
  created_date: Date;
  updated_date: Date;
}