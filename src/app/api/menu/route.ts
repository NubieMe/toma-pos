import { errorHandler } from "@/utils/helper"
import { ResponseError } from "@/lib/error/response-error"
import { NextRequest, NextResponse } from "next/server"
import { getAllMenu, getSidebarMenu, insertMenu } from "@/repositories/menu.server"
import { prisma } from "@/lib/prisma"
import { serialize } from "cookie"
import { getUserSessionFromRequest, isProd } from "@/lib/session"
import { Menu } from "@/types/menu"

export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams
        const sidebar = params.get('sidebar') === 'true'
        const user = getUserSessionFromRequest(req)

        let data = (sidebar ? await getSidebarMenu() : await getAllMenu()) as Menu[]

        const availMenu: string[] = [];
        if (sidebar) {
            data = data.filter((menu: Menu) => {
                if (menu.permissions?.some(p => p.role_id === user?.role.id)) {

                    const subMenu = menu.children?.filter((subMenu: Menu) => {
                        if (subMenu.permissions?.some(p => p.role_id === user?.role.id)) {
                            
                            const grandSubMenu = subMenu.children?.filter((grandSubMenu: Menu) => {  
                                if (grandSubMenu.permissions?.some(p => p.role_id === user?.role.id)) {

                                    if (grandSubMenu.path) availMenu.push(grandSubMenu.path)
                                    return grandSubMenu
                                }
                            })

                            if (subMenu.path) availMenu.push(subMenu.path)
                            return grandSubMenu
                        }
                    })
                    
                    if (menu.path) availMenu.push(menu.path)
                    return subMenu
                }
            })
        }

        const res = NextResponse.json({ data })
        if (sidebar) res.headers.set(
            'Set-Cookie', 
            serialize('sidecook', 
                JSON.stringify(availMenu),
                {
                    path: '/',
                    secure: isProd,
                    sameSite: 'lax',
                    httpOnly: true,
                }
            ))
        return res
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const data = await insertMenu(body)

        const role = await prisma.role.findUnique({ where: { name: 'root' } })

        if (role) {
            const permission = await prisma.permission.create({
                data: {
                    role_id: role.id!,
                    menu_id: data.id,
                    create: true,
                    read: true,
                    update: true,
                    delete: true,
                },
                include: {
                    role: true,
                    menu: true
                }
            })

            data.permissions = [permission]
        }

        return NextResponse.json({ message: "Menu created successfully", data })
    } catch (error) {
       return errorHandler(error as ResponseError) 
    }
}