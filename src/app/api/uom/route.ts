import { NextRequest, NextResponse } from "next/server";
import { ServiceFactory } from "@/services/service-factory";
import { ResponseError } from "@/lib/error/response-error";
import { errorHandler } from "@/utils/helper";
import { Session } from "@/types/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const data = await ServiceFactory.create('uom', body, user.id)

    return NextResponse.json({
      message: "UOM berhasil ditambahkan",
      data,
    }, { status: 201 })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { total, data } = await ServiceFactory.getAll('uom', req.nextUrl.searchParams)

    return NextResponse.json({
      total,
      data,
    }, { status: 200 })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}