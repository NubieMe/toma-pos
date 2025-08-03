import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { getUserByUsername } from "@/repositories/users.server";
import { ServiceFactory } from "@/services/service-factory";
import { errorHandler } from "@/utils/helper";
import { Prisma } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await ServiceFactory.getOne('user', id, { profile: true, branch: true, role: true });

    if (!data) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return errorHandler(error as ResponseError);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const user = JSON.parse(req.headers.get('x-user-payload')!);
    const { username, password, branch_id, role_id, confirm, ...rest } = await req.json();

    const body: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput> = {
      username,
      branch_id,
      role_id,
      updated_by: user.id,
      profile: {
        update: {
          ...rest,
          updated_by: user.id
        },
      },
    }

    const existingUser = await ServiceFactory.getOne('user', id);
    if (!existingUser) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    if (user.id === id && password) {
      const isMatch = await compare(confirm, existingUser.password)
      if (!isMatch) {
        return NextResponse.json({ message: 'Password tidak sesuai' }, { status: 401 });
      }

      const hashed = await hash(password, 10);
      body.password = hashed;
    }

    if (existingUser.username !== username) {
      const userExists = await getUserByUsername(username);
      if (userExists) {
        return NextResponse.json({ message: 'Username sudah ada' }, { status: 400 });
      }
    }

    if (existingUser.role_id !== role_id) {
      const roleExists = await ServiceFactory.count('role', role_id);
      if (!roleExists) {
        return NextResponse.json({ message: 'Role tidak ditemukan' }, { status: 404 });
      }
    }

    if (existingUser.branch_id !== branch_id) {
      const branchExists = await ServiceFactory.count('branch', branch_id);
      if (!branchExists) {
        return NextResponse.json({ message: 'Branch tidak ditemukan' }, { status: 404 });
      }
    }

    const data = await prisma.user.update({
      where: {
        id,
      },
      data: body,
    })

    return NextResponse.json({ message: 'User updated successfully', data });
  } catch (error) {
    return errorHandler(error as ResponseError);
  }
}