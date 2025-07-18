import { convertSeparator, errorHandler } from "@/utils/helper"
import { ResponseError } from "@/lib/error/response-error"
import { getCompany } from "@/repositories/company.server"
import { NextRequest, NextResponse } from "next/server"
import { Session } from "@/types/session"
import { ServiceFactory } from "@/services/service-factory"

export async function GET() {
  try {
    const data = await getCompany()

    return NextResponse.json({ data })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function POST(req: NextRequest) {
  try {
      const body = await req.json()
      const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
      const company = await getCompany()

      Object.keys(body).forEach(key => {
        if (key.includes('separator')) {
          body[key] = convertSeparator(body[key])
        }
      })

      const data = company ? await ServiceFactory.update('company', company.id, body, user!.id) : await ServiceFactory.create('company', body, user!.id)

      return NextResponse.json({
          message: `Company berhasil ${company ? 'diperbarui' : 'ditambahkan'}`,
          data,
      }, { status: company ? 200 : 201 })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}