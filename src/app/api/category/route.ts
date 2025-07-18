import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { getCompany } from "@/repositories/company.server";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { errorHandler } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const body = await req.json();
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const company = await getCompany()

    if (!company) {
      return NextResponse.json({
        message: 'Silahkan setup Company terlebih dahulu',
      }, { status: 400 })
    }

    let data
    if (company.category_auto) {
      data = await prisma.$transaction(async tx => {
        const codeParts: string[] = []
        const format = {
          hasYear: false,
          hasMonth: false,
          seqIndex: -1
        }

        company.category_format?.split('-').forEach((part, i) => {
          const lower = part.toLowerCase()
          if (lower === 'yy' || lower === 'yyyy') {
            format.hasYear = true
            codeParts.push(year.toString().substring(4 - lower.length))
          } else if (lower === 'mm') {
            format.hasMonth = true
            codeParts.push((month + 1).toString().padStart(2, '0'))
          } else if ([...lower].every(c => c === 's')) {
            format.seqIndex = i
            codeParts.push(lower)
          } else {
            codeParts.push(part)
          }
        })

        let seq = await ServiceFactory.getSequence('category', tx)
        if (!seq) {
          seq = await ServiceFactory.createSequence(
            {
              name: 'category',
              year: format.hasYear ? year : null,
            },
            tx
          )
        } else if (format.hasYear && (seq.year !== year)) {
          seq.year = year
          seq.number = 0
        }
        seq.number++

        if (format.seqIndex !== -1) {
          const len = codeParts[format.seqIndex].length
          codeParts[format.seqIndex] = seq.number.toString().padStart(len, '0')
        }
        
        body.code = codeParts.join(company.category_separator ?? '')

        const created = await ServiceFactory.create('category', body, user.id, undefined, tx)
        await ServiceFactory.updateSequence(seq.id, { number: seq.number, year: seq.year }, tx)

        return created
      })
    } else {
      data = await ServiceFactory.create('category', body, user.id)
    }

    return NextResponse.json({
      message: "Category berhasil ditambahkan",
      data,
    }, { status: 201 })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { data, total } = await ServiceFactory.getAll('category', req.nextUrl.searchParams)

    return NextResponse.json({ data, total })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}