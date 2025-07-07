import { prisma } from "@/lib/prisma"
import { MenuBody } from "@/types/menu"

export const getSidebarMenu = async () => {
    return await prisma.menu.findMany({ 
        where: { parent_id: null },
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
    })
}

export const getAllMenu = async () => {
    return await prisma.menu.findMany({ 
        include: { 
            permissions: true,
            parent: true,
        },
        orderBy: {
            id: 'desc'
        }
    })
}

export const insertMenu = async (data: MenuBody) => {
    return await prisma.menu.create({ data, include: { children: true, permissions: true } })
}