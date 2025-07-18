import { ResponseError } from "@/lib/error/response-error";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { errorHandler } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await ServiceFactory.getOne('item', id, { uom: true, category: true })

    if (!data) {
      return NextResponse.json({ message: "Item tidak ditemukan" }, { status: 404 })
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
    const existing = await ServiceFactory.getOne('item', id)

    if (!existing) {
      return NextResponse.json({ message: "Item tidak ditemukan" }, { status: 404 })
    }

    if (existing.uom_id !== body.uom_id) {
      const uom = await ServiceFactory.getOne('uom', body.uom_id)
      if (!uom) {
        return NextResponse.json({ message: "UOM tidak ditemukan" }, { status: 404 })
      }
    }

    if (existing.category_id !== body.category_id) {
      const category = await ServiceFactory.getOne('category', body.category_id)
      if (!category) {
        return NextResponse.json({ message: "Category tidak ditemukan" }, { status: 404 })
      }
    }
    const data = await ServiceFactory.update('item', id, body, user.id)

    return NextResponse.json({ message: "Item berhasil diperbarui", data })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const existing = await ServiceFactory.count('item', id)

    if (!existing) {
      return NextResponse.json({ message: "Item tidak ditemukan" }, { status: 404 })
    }

    const data = await ServiceFactory.delete('item', id, user.id)

    return NextResponse.json({ message: "Item berhasil dihapus", data })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}