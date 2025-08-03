import { prisma } from "@/lib/prisma";

export const getPermissionByRole = async (role_id: string) => {
  return await prisma.permission.findMany({
    where: {
      role_id
    }
  })
}

export const getPermissionByMenu = async (menu_id: string) => {
  return await prisma.permission.findMany({
    where: {
      menu_id
    }
  })
}
