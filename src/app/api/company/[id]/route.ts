import { errorHandler } from "@/utils/helper";
import { ResponseError } from "@/lib/error/response-error";
import { Session } from "@/types/session";
import { ServiceFactory } from "@/services/service-factory";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const user = JSON.parse(req.headers.get('x-user-payload')!) as Session

        const data = id ? await ServiceFactory.update('company', id, body, user!.id) : await ServiceFactory.create('company', body, user!.id)

        return NextResponse.json({
            message: `Company ${id ? 'updated' : 'created'} successfully`,
            data,
        }, { status: id ? 200 : 201 })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}