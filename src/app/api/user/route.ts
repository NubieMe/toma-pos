import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { errorHandler } from '@/utils/helper'
import { ResponseError } from '@/lib/error/response-error'
import { ServiceFactory } from '@/services/service-factory'
import { Session } from '@/types/session'
import { getCompany } from '@/repositories/company.server'

export async function POST(req: NextRequest) {
  try {
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()

    if (!user || !['administrator', 'root'].includes(user.role.name!)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { username, password, role_id, branch_id, ...rest } = await req.json()

    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) return NextResponse.json({ message: 'Username sudah ada' }, { status: 400 })

    const role = await ServiceFactory.count('role', role_id)
    if (!role) return NextResponse.json({ message: 'Role tidak ditemukan' }, { status: 404 })

    const branch = await ServiceFactory.count('branch', branch_id)
    if (!branch) return NextResponse.json({ message: 'Branch tidak ditemukan' }, { status: 404 })

    const company = await getCompany()
    if (!company) return NextResponse.json({ message: 'Silahkan setup Company terlebih dahulu' }, { status: 400 })

    const hashed = await hash(password, 10)

    const data = await prisma.$transaction(async tx => {
      if (company.user_auto) {
        const codeParts: string[] = []
        const format = {
          hasYear: false,
          hasMonth: false,
          seqIndex: -1
        }

        company.user_format?.split('-').forEach((part, i) => {
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

        let seq = await ServiceFactory.getSequence('user', tx)
        if (!seq) {
          seq = await ServiceFactory.createSequence(
            {
              name: 'user',
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

        rest.code = codeParts.join(company.user_separator ?? '')
      } else {
        if (!rest.code) throw new ResponseError('Code is required', 400)
      }

      const created = await tx.user.create({
        data: {
          username,
          password: hashed,
          role_id,
          branch_id,
          created_by: user.id,
          profile: {
            create: {
              ...rest,
              created_by: user.id
            },
          },
        },
        select: {
          id: true,
          username: true,
          role: true,
          profile: true,
          branch: true,
          created_date: true,
        }
      })

      return created
    })

    return NextResponse.json({ message: 'User berhasil ditambahkan', data }, { status: 201 })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { data, total } = await ServiceFactory.getAll('user', req.nextUrl.searchParams, { profile: true, branch: true, role: true })

    return NextResponse.json({ data, total })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}