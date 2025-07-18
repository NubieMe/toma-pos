import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().nonempty("Name tidak boleh kosong"),
  code: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().nonempty("Category tidak boleh kosong"),
  uom_id: z.string().nonempty("UOM tidak boleh kosong"),
})

export const itemWithCodeSchema = z.object({
  name: z.string().nonempty("Name tidak boleh kosong"),
  code: z.string().nonempty("Code tidak boleh kosong"),
  description: z.string().optional(),
  category_id: z.string().nonempty("Category tidak boleh kosong"),
  uom_id: z.string().nonempty("UOM tidak boleh kosong"),
})
