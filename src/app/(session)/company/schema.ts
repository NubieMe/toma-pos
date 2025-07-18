import { separator } from "@/constant/enum";
import { z } from "zod";

export const companySchema = z.object({
    name: z.string().nonempty("Name is required"),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    logo: z.string().optional(),
    category_auto: z.boolean(),
    category_format: z.string().optional(),
    category_separator: z.enum(separator).nullable(),
    user_auto: z.boolean(),
    user_format: z.string().optional(),
    user_separator: z.enum(separator).nullable(),
    item_auto: z.boolean(),
    item_format: z.string().optional(),
    item_separator: z.enum(separator).nullable(),
})