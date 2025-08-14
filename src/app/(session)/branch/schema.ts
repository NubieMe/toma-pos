import { z } from "zod";

export const branchSchema = z.object({
  code: z.string().nonempty("Singkatan tidak boleh kosong").min(3, "Singkatan minimal 3 karakter").max(4, "Singkatan maksimal 4 karakter"),
  name: z.string().nonempty("Name tidak boleh kosong"),
  address: z.string().optional(),
  phone: z.string().optional(),
  coordinate: z.array(z.number()).length(2),
})