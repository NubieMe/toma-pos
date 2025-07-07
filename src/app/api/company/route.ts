import { errorHandler } from "@/utils/helper"
import { ResponseError } from "@/lib/error/response-error"
import { getCompany } from "@/repositories/company.server"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const data = await getCompany()

        return NextResponse.json({ data })
    } catch (error) {
        return errorHandler(error as ResponseError)
    }
}