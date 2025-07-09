import { NextRequest, NextResponse } from "next/server"
import { ServiceFactory } from "@/services/service-factory"
import { ResponseError } from "@/lib/error/response-error"
import { errorHandler } from "@/utils/helper"
import { Session } from "@/types/session"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const data = await ServiceFactory.getOne('uom', id)

        return NextResponse.json({
            data,
        })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
        const data = await ServiceFactory.update('uom', id, body, user.id)

        return NextResponse.json({ message: "UOM updated successfully", data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
        const data = await ServiceFactory.delete('uom', id, user.id)

        return NextResponse.json({ message: "UOM deleted successfully", data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}