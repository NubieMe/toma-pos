import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { errorHandler } from "@/utils/helper";
import { Permission } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: roleId } = params;
    const newPermissions = await req.json() as Omit<Permission, 'created_by' | 'created_date' | 'updated_by' | 'updated_date'>[];
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session;

    const role = await ServiceFactory.getOne('role', roleId);
    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    const dataToInsert = newPermissions.map(p => ({
      ...p,
      role_id: roleId,
      created_by: user.id,
      created_date: new Date(),
    }));

    await prisma.$transaction(async (tx) => {

      await tx.permission.deleteMany({
        where: { role_id: roleId },
      });

      if (dataToInsert.length > 0) {
        await tx.permission.createMany({
          data: dataToInsert,
        });
      }
    });
    
    return NextResponse.json({ message: "Permission berhasil disimpan" });
  } catch (error) {
    return errorHandler(error as ResponseError);
  }
}