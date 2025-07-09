import { prisma } from "@/lib/prisma"

export const getSidebarMenu = async () => {
  const [data, total] = await Promise.all([
    prisma.menu.findMany({ 
      where: { parent_id: null, is_active: true, deleted_date: null },
      include: { 
        permissions: true,
        children: {
          include: {
            permissions: true,
            children: {
              include: {
                permissions: true,
                children: true
              }
            }
          }
        }
      }
    }),
    prisma.menu.count({ where: { parent_id: null } }),
  ])

  return { data, total }
}
