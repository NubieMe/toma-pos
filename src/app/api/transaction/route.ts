import { ResponseError } from "@/lib/error/response-error";
import { ServiceFactory } from "@/services/service-factory";
import { errorHandler } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { data, total } = await ServiceFactory.getAll('transaction', req.nextUrl.searchParams, {
      products: {
        include: {
          stock: true,
        },
      },
      charges: true,
      branch: true,
    });

    return NextResponse.json({ data, total });
  } catch (error) {
    return errorHandler(error as ResponseError);
  }
}