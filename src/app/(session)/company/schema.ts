import { separator } from "@/constant/enum";
import { z } from "zod";

export const companySchema = z.object({
    name: z.string().nonempty("Name is required"),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    logo: z.string().optional(),
    ppn: z.coerce.number().min(0, "PPN must be at least 0").max(100, "PPN cannot exceed 100"),
    category_auto: z.boolean(),
    category_format: z.string().optional(),
    category_separator: z.enum(separator).nullable(),
    user_auto: z.boolean(),
    user_format: z.string().optional(),
    user_separator: z.enum(separator).nullable(),
    item_auto: z.boolean(),
    item_format: z.string().optional(),
    item_separator: z.enum(separator).nullable(),
}).refine(data => {
  // Jika auto-generate kategori tidak aktif, lewati validasi ini
  if (!data.category_auto) return true;

  // Jika aktif, format harus diisi
  if (!data.category_format) return false;
  
  const parts = data.category_format.split('-');
  
  // Dua bagian pertama wajib diisi
  const part1_valid = parts[0] && parts[0].trim() !== '';
  const part2_valid = parts[1] && parts[1].trim() !== '';

  return part1_valid && part2_valid;
}, {
  message: "Dua format pertama untuk kategori wajib diisi.",
  path: ["category_format"], 
})