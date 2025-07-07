import { z } from "zod";

export const companySchema = z.object({
    name: z.string().nonempty("Name is required"),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    logo: z.string().optional(),
})