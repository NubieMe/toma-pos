import { NextRequest, NextResponse } from "next/server";
import { ResponseError } from "@/lib/error/response-error";
import { errorHandler } from "@/utils/helper";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";

const unedited = ["root", "administrator"];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await ServiceFactory.getOne('role', id);

        return NextResponse.json({ data });
    } catch (error) {
        return errorHandler(error as ResponseError);
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const existingRole = await ServiceFactory.getOne('role', id);
        const user = JSON.parse(req.headers.get('x-user-payload')!) as Session

        if (!existingRole) {
            return NextResponse.json({ message: "Role not found" }, { status: 404 });
        } else if (unedited.includes(existingRole.name)) {
            return NextResponse.json({ message: "Role cannot be edited" }, { status: 403 });
        }
        const data = await ServiceFactory.update('role', id, body, user.id);

        return NextResponse.json({ message: "Role updated successfully", data });
    } catch (error) {
        return errorHandler(error as ResponseError);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const existingRole = await ServiceFactory.getOne('role', id);
        const user = JSON.parse(req.headers.get('x-user-payload')!) as Session

        if (!existingRole) {
            return NextResponse.json({ message: "Role not found" }, { status: 404 });
        } else if (unedited.includes(existingRole.name)) {
            return NextResponse.json({ message: "Role cannot be deleted" }, { status: 403 });
        }
        const data = await ServiceFactory.delete('role', id, user.id);

        return NextResponse.json({ message: "Role deleted successfully", data });
    } catch (error) {
        return errorHandler(error as ResponseError);
    }
}