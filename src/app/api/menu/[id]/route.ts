import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/utils/helper";
import { ResponseError } from "@/lib/error/response-error";
import { ServiceFactory } from "@/services/service-factory";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()

        const data = await ServiceFactory.update('menu', id, body)

        return NextResponse.json({ message: "Menu updated successfully", data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}

export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const data = await ServiceFactory.delete('menu', id)

        return NextResponse.json({ message: "Menu deleted successfully", data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}

export async function GET({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const data = await ServiceFactory.getOne('menu', id)

        return NextResponse.json({ data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}