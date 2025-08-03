import { prisma } from "@/lib/prisma";

export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            username: true,
            role: true,
            profile: true,
            branch: true,
            created_date: true,
        },
    });
}

export const getUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({
        where: {
            username,
        },
        include: {
            role: true,
            profile: true,
            branch: true
        }
    });
}

export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            role: true,
            profile: true,
            created_date: true,
        },
    });
}

export const createUser = async (username: string, password: string, roleId: string) => {
    return await prisma.user.create({
        data: {
            username,
            password,
            role_id: roleId,
        },
        select: {
            id: true,
            username: true,
            role: true,
            profile: true,
            created_date: true,
        },
    });
}
