import { NextRequest, NextResponse } from "next/server";
import { ResponseError } from "@/lib/error/response-error";
import { errorHandler } from "@/utils/helper";
import { deleteRole, getRoleById, updateRole } from "@/repositories/role.server";

const unedited = ["root", "administrator"];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await getRoleById(id);

        return NextResponse.json({ data });
    } catch (error) {
        return errorHandler(error as ResponseError);
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const existingRole = await getRoleById(id);

        if (!existingRole) {
            return NextResponse.json({ message: "Role not found" }, { status: 404 });
        } else if (unedited.includes(existingRole.name)) {
            return NextResponse.json({ message: "Role cannot be edited" }, { status: 403 });
        }
        const data = await updateRole(id, body);

        return NextResponse.json({ message: "Role updated successfully", data });
    } catch (error) {
        return errorHandler(error as ResponseError);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const existingRole = await getRoleById(id);

        if (!existingRole) {
            return NextResponse.json({ message: "Role not found" }, { status: 404 });
        } else if (unedited.includes(existingRole.name)) {
            return NextResponse.json({ message: "Role cannot be deleted" }, { status: 403 });
        }
        const data = await deleteRole(id);

        return NextResponse.json({ message: "Role deleted successfully", data });
    } catch (error) {
        return errorHandler(error as ResponseError);
    }
}