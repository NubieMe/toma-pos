import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter").max(50, "Username maksimal 50 karakter"),
  password: z.string().min(8, "Password minimal setidaknya 8 karakter").optional(),
  confirm: z.string().optional(),
  code: z.string().optional(),
  name: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  birthdate: z.date(),
  gender: z.enum(['L', 'P']),
  religion: z.enum(['Islam', 'Katolik', 'Protestan', 'Hindu', 'Budha', 'Konghucu', 'Lainnya']),
  role_id: z.string(),
  branch_id: z.string().optional(),
}).refine(
  data => {
    if (data.password) {
      return data.password === data.confirm;
    }
    return true;
  },
  {
    message: 'Password dan konfirmasi password harus sama',
    path: ['confirm'],
  }
)