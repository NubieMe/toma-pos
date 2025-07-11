import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/utils/helper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.permission.findMany()

    return NextResponse.json({
      data,
    }, { status: 200 })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}