import { IOType } from "@prisma/client";
import { z } from "zod";

export const stockSchema = z.object({
  item_id: z.string().nonempty("Item tidak boleh kosong"),
  branch_id: z.string().nonempty("Branch tidak boleh kosong"),
  vendible: z.boolean(),
  qty: z.coerce.number({ invalid_type_error: "Qty tidak boleh kosong" }),
  price: z.coerce.number({ invalid_type_error: "Price tidak boleh kosong" }),
})

export const stockIOSchema = z.object({
  item_id: z.string().nonempty("Item tidak boleh kosong"),
  branch_id: z.string().nonempty("Branch tidak boleh kosong"),
  to_id: z.string().optional(),
  type: z.nativeEnum(IOType),
  price: z.coerce.number(),
  qty: z.coerce.number({ invalid_type_error: "Qty tidak boleh kosong" }).min(1, "Qty tidak boleh nol"),
  note: z.string().optional(),
}).refine(data => {
    if (data.type === 'purchase') {
      return data.price !== undefined && data.price > 0
    }

    return true
  },
  {
    message: 'Price tidak boleh nol',
    path: ['price'],
  }
)