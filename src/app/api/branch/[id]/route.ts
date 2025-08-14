import { ResponseError } from "@/lib/error/response-error";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { errorHandler } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await ServiceFactory.getOne('branch', id)

    if (!data) {
      return NextResponse.json({ message: "Branch tidak ditemukan" }, { status: 404 })
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
    const existing = await ServiceFactory.getOne('branch', id)

    if (!existing) {
      return NextResponse.json({ message: "Branch tidak ditemukan" }, { status: 404 })
    }

    if (body.code !== existing.code) {
      const existingCode = await ServiceFactory.count('branch', body.code)
      if (existingCode) {
        return NextResponse.json({ message: "Kode branch sudah digunakan" }, { status: 400 })
      }
    }
  
    const data = await ServiceFactory.update('branch', id, body, user.id)
  
    return NextResponse.json({ data, message: "Branch berhasil diperbarui" })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const existing = await ServiceFactory.count('branch', id)

    if (!existing) {
      return NextResponse.json({ message: "Branch tidak ditemukan "}, { status: 404 })
    }

    const data = await ServiceFactory.delete('branch', id, user.id)

    return NextResponse.json({ message: "Branch berhasil dihapus", data })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}