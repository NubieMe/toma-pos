import { z } from "zod";

export const menuSchema = z.object({
    name: z.string().nonempty("Name is required").max(50, "Name must be at most 50 characters long"),
    path: z.string().optional(),
    icon: z.string().optional(),
    parent_id: z.string().nullable(),
    order: z.number(),
    is_active: z.boolean(),
    features: z.array(z.string()),
})