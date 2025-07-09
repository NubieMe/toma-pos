import { prisma } from "@/lib/prisma";
import { PermissionID } from "@/types/permission";
import { Permission, Prisma } from "@prisma/client";

export const insertPermissions = async (data: Permission[], tx?: Prisma.TransactionClient) => {
  return await (tx ?? prisma).permission.createMany({
    data,
  });
}

export const deletePermissions = async (ids: PermissionID[], tx?: Prisma.TransactionClient) => {
  return await (tx ?? prisma).permission.deleteMany({
    where: {
      OR: ids,
    }
  })
}

export const updatePermissions = async (data: Permission[], tx?: Prisma.TransactionClient) => {
  const client = tx ?? prisma

  const update = data.map(permission => client.permission.update({
    where: {
      role_id_menu_id: {
        role_id: permission.role_id,
        menu_id: permission.menu_id,
      },
    },
    data: {
      create: permission.create,
      read: permission.read,
      update: permission.update,
      delete: permission.delete,
      updated_by: permission.updated_by,
      updated_date: new Date(),
    }
  }))

  if (!tx) {
    return await prisma.$transaction(update)
  } else {
    return await Promise.all(update)
  }
}

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
