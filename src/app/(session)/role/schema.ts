import { z } from "zod";

export const roleSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().optional(),
})