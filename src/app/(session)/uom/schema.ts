import { z } from "zod";

export const uomSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().optional(),
})