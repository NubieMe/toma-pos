import { errorHandler } from "@/utils/helper"
import { ResponseError } from "@/lib/error/response-error"
import { NextRequest, NextResponse } from "next/server"
import { getSidebarMenu } from "@/repositories/menu.server"
import { prisma } from "@/lib/prisma"
import { serialize } from "cookie"
import { Session } from "@/types/session"
import { Menu } from "@/types/menu"
import config from "@/config"
import { ServiceFactory } from "@/services/service-factory"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const sidebar = params.get('sidebar') === 'true'
    const permission = params.get('permission') === 'true'
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
  
    const include: Prisma.MenuInclude = {
      parent: true,
      permissions: true,
    }

    // eslint-disable-next-line prefer-const
    let { data, total } = (sidebar || permission ? await getSidebarMenu() : await ServiceFactory.getAll('menu', params, include))

    const availMenu: string[] = [];
    if (sidebar || permission) {
      data = data.filter((menu: Menu) => {
        if (menu.permissions?.some(p => (sidebar ? p.role_id === user?.role.id : true) && menu.is_active && menu.deleted_date === null)) {
          menu.children = menu.children?.filter((subMenu: Menu) => {
            if (subMenu.permissions?.some(p => (sidebar ? p.role_id === user?.role.id: true) && subMenu.is_active && subMenu.deleted_date === null)) {
              const subLower = subMenu.name.toLowerCase()

              if (permission && subLower.includes('menu') && subLower.includes('config')) return false
              
              subMenu.children = subMenu.children?.filter((grandSubMenu: Menu) => {  
                if (grandSubMenu.permissions?.some(p => (sidebar ? p.role_id === user?.role.id : true) && grandSubMenu.is_active && grandSubMenu.deleted_date === null)) {

                  if (grandSubMenu.path) availMenu.push(grandSubMenu.path)
                  return grandSubMenu
                }
              })

              if (subMenu.path) availMenu.push(subMenu.path)
              return true
            }
          })
          
          if (menu.path) availMenu.push(menu.path)
          return true
        }
      })
    }

    const res = NextResponse.json({ data, total })
    if (sidebar) res.headers.set(
      'Set-Cookie', 
      serialize('sidecook', 
        JSON.stringify(availMenu),
        {
          path: '/',
          secure: config.production,
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
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const data = await ServiceFactory.create('menu', body, user.id)

    const role = await prisma.role.findUnique({ where: { name: 'root' } })
    const roleAdmin = await prisma.role.findUnique({ where: { name: 'administrator' } })

    if (role) {
      const permission = await prisma.permission.create({
        data: {
          role_id: role.id!,
          menu_id: data.id,
          create: true,
          read: true,
          update: true,
          delete: true,
          created_by: user.id
        },
        include: {
          role: true,
          menu: true
        }
      })

      data.permissions = [permission]
    }

    if (roleAdmin) {
      const permission = await prisma.permission.create({
        data: {
          role_id: roleAdmin.id!,
          menu_id: data.id,
          create: true,
          read: true,
          update: true,
          delete: true,
          created_by: user.id
        },
        include: {
          role: true,
          menu: true
        }
      })

      data.permissions = data.permissions ? [...data.permissions, permission] : [permission]
    }

    return NextResponse.json({ message: "Menu created successfully", data })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}