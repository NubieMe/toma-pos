import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { deletePermissions, getPermissionByRole, insertPermissions, updatePermissions } from "@/repositories/permission.server";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { errorHandler } from "@/utils/helper";
import { Permission } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json() as Permission[]
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const role = await ServiceFactory.getOne('role', id)
    
    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 })
    }
    
    const existingData = await getPermissionByRole(id)
    const inserted = body.filter(b => !existingData.some(p => p.role_id === b.role_id && p.menu_id === b.menu_id))
      .map(b => ({ ...b, created_date: new Date(), created_by: user.id }))

    const deleted = existingData.filter(p => !body.some(b => b.role_id === p.role_id && b.menu_id === p.menu_id))
      .map(e => ({ role_id: e.role_id, menu_id: e.menu_id }))
    
    const updated = body.filter(b => !inserted.some(i => i.role_id === b.role_id && i.menu_id === b.menu_id))
      .map(b => ({ ...b, updated_date: new Date(), updated_by: user.id }))
    
    await prisma.$transaction(async tx => {
      if (inserted.length) {
        await insertPermissions(inserted, tx)
      }
  
      if (updated.length) {
        await updatePermissions(updated, tx)
      }
  
      if (deleted.length) {
        await deletePermissions(deleted, tx)
      }
    })
    
    return NextResponse.json({ message: "Permission saved successfully" })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}