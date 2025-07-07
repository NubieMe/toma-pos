import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/utils/helper";
import { ResponseError } from "@/lib/error/response-error";
import { countRole, getAllRoles, getRoleByName, insertRole } from "@/repositories/role.server";
import { getUserSessionFromRequest } from "@/lib/session";
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
        const user = getUserSessionFromRequest(req);

        const where: Prisma.RoleWhereInput = user?.role.name === 'root' ? {} : { name: { not: 'root' } };
        const [data, total] = await Promise.all([
            await getAllRoles(where),
            await countRole(where as Prisma.RoleCountArgs),
        ])
        
        return NextResponse.json({
            data,
            total
        });
    } catch (error) {
        return errorHandler(error as ResponseError);
    }
}