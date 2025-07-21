import { ResponseError } from "@/lib/error/response-error";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { errorHandler } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { data, total } = await ServiceFactory.getAll('branch', req.nextUrl.searchParams)
    for (const item of data) {
      item.coordinate = JSON.parse(item.coordinate)
    }

    return NextResponse.json({ data, total })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    body.coordinate = JSON.stringify(body.coordinate)

    const data = await ServiceFactory.create('branch', body, user.id)

    return NextResponse.json({ data, message: "Branch berhasil ditambahkan" }, { status: 201 })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}