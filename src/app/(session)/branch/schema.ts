import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().nonempty("Name tidak boleh kosong"),
  address: z.string().optional(),
  phone: z.string().optional(),
  coordinate: z.array(z.number()).length(2),
})