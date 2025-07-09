import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/utils/helper";
import { ResponseError } from "@/lib/error/response-error";
import { countRole, getAllRoles, getRoleByName, insertRole } from "@/repositories/role.server";
import { Session } from "@/types/session";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const existingRole = await getRoleByName(body.name);

    if (existingRole) {
      return NextResponse.json({
        message: "Role already exists" 
      }, { status: 400 });
    }

    const data = await insertRole(body);

    return NextResponse.json({
      message: "Role created successfully",
      data,
    }, { status: 201 });
  } catch (error) {
    return errorHandler(error as ResponseError);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const query = req.nextUrl.searchParams
    const page = parseInt(query.get('page')!) || 1
    const limit = parseInt(query.get('limit')!) || 10
    const skip = (page - 1) * limit
    const search = query.get('search') ? JSON.parse(query.get('search')!) : {}

    let order: Prisma.RoleOrderByWithRelationInput = { created_date: 'desc' }
    if (query.get('order')) {
      const sort = query.get('order')!.split('-')
      order = { [sort[0]]: sort[1] }
    }

    const where: Prisma.RoleWhereInput = user?.role.name === 'root' ? {} : { name: { not: 'root' } };

    Object.keys(search).forEach(key => {
      if (key.includes('-')) {
        console.log(key, search[key])
        const fields = key.split('-')
        where.OR = fields.map(f => ({ [f]: { contains: search[key] } }))
      } else if (key === 'name' || key === 'description') {
        where[key] = { contains: search[key] }
      }
    })

    const [data, total] = await Promise.all([
      getAllRoles(where, limit, skip, order),
      countRole(where),
    ])

    return NextResponse.json({
      data,
      total
    });
  } catch (error) {
    return errorHandler(error as ResponseError);
  }
}