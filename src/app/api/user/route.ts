// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { errorHandler } from '@/utils/helper'
import { ResponseError } from '@/lib/error/response-error'
import { ServiceFactory } from '@/services/service-factory'
import { Session } from '@/types/session'

export async function POST(req: NextRequest) {
  const currentUser = JSON.parse(req.headers.get('x-user-payload')!) as Session

  if (!currentUser || !['administrator', 'root'].includes(currentUser.role.name!)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { username, password, role_id } = await req.json()

  const existingUser = await prisma.user.findUnique({ where: { username } })
  if (existingUser) return NextResponse.json({ message: 'Username sudah ada' }, { status: 400 })

  const existingRole = await prisma.role.findUnique({ where: { id: role_id } })
  if (!existingRole) return NextResponse.json({ message: 'Role tidak ditemukan' }, { status: 400 })

  const hashed = await hash(password, 10)

  const data = await prisma.user.create({
    data: {
      username,
      password: hashed,
      role_id,
    },
    select: {
      id: true,
      username: true,
      role: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json({ message: 'User berhasil ditambahkan', data }, { status: 201 })
}

export async function GET(req: NextRequest) {
  try {
    const data = await ServiceFactory.getAll('user', req.nextUrl.searchParams)

    if (!data) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}