import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MenuBody } from "@/types/menu";

export const getRoleByName = async (name: string) => {
    return await prisma.role.findUnique({
        where: {
            name,
        },
    });
}

export const getRoleById = async (id: string) => {
    return await prisma.role.findUnique({
        where: {
            id,
        },
    });
}

export const getAllRoles = async (where: Prisma.RoleWhereInput, take: number, skip: number, orderBy: Prisma.RoleOrderByWithRelationInput) => {
    return await prisma.role.findMany({
        where,
        take,
        skip,
        orderBy,
    });
}

export const insertRole = async (data: MenuBody) => {
    return await prisma.role.create({
        data
    })
}

export const updateRole = async (id: string, data: MenuBody) => {
    return await prisma.role.update({
        where: {
            id,
        },
        data,
    });
}

export const deleteRole = async (id: string) => {
    return await prisma.role.delete({
        where: {
            id,
        },
    });
}

export const countRole = async (where: Prisma.RoleWhereInput) => {
    return await prisma.role.count({
        where
    });
}