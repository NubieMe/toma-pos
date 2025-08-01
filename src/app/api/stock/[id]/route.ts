import { ResponseError } from "@/lib/error/response-error";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { errorHandler } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await ServiceFactory.getOne('stock', id)

    if (!data) {
      return NextResponse.json({ message: "Stock tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { 
    const { id } = await params
    const body = await req.json()
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const existing = await ServiceFactory.count('stock', id)

    if (!existing) {
      return NextResponse.json({ message: "Stock tidak ditemukan" }, { status: 404 })
    }

    const data = await ServiceFactory.update('stock', id, body, user.id, undefined, undefined, { item: true, branch: true })

    return NextResponse.json({ data, message: 'Stock berhasil diperbarui '})
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const existing = await ServiceFactory.count('stock', id)

    if (!existing) {
      return NextResponse.json({ message: "Stock tidak ditemukan" }, { status: 404 })
    }

    const data = await ServiceFactory.delete('stock', id, user.id)

    return NextResponse.json({ data, message: 'Stock berhasil diperbarui '})
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}