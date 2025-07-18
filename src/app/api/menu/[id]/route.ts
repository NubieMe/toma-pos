import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/utils/helper";
import { ResponseError } from "@/lib/error/response-error";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
        const existing = await ServiceFactory.count('menu', id)

        if (!existing) {
            return NextResponse.json({ message: "Menu tidak ditemukan" }, { status: 404 })
        }

        const data = await ServiceFactory.update('menu', id, body, user.id)

        return NextResponse.json({ message: "Menu berhasil diperbarui", data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
        const existing = await ServiceFactory.count('menu', id)

        if (!existing) {
            return NextResponse.json({ message: "Menu tidak ditemukan" }, { status: 404 })
        }
        const data = await ServiceFactory.delete('menu', id, user!.id)

        return NextResponse.json({ message: "Menu berhasil dihapus", data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const data = await ServiceFactory.getOne('menu', id)

        if (!data) {
            return NextResponse.json({ message: "Menu tidak ditemukan" }, { status: 404 })
        }

        return NextResponse.json({ data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}