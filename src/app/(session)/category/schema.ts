import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().nonempty("Name tidak boleh kosong"),
    code: z.string().optional(),
    description: z.string().optional(),
})

export const categoryWithCodeSchema = z.object({
    name: z.string().nonempty("Name tidak boleh kosong"),
    code: z.string().nonempty("Code tidak boleh kosong"),
    description: z.string().optional(),
})