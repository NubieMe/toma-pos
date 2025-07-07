/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodType } from 'zod'
import { validate } from '@/utils/validator'
import { PrismaClient, Prisma } from '@prisma/client'
import { ResponseError } from '@/lib/error/response-error'
import { prisma } from '@/lib/prisma'
import { queryMonth } from '@/utils/helper'

function getModel<T extends keyof PrismaClient>(
  model: T,
  tx?: Prisma.TransactionClient
) {
  return (tx ? (tx as PrismaClient)[model] : prisma[model])
}

export class ServiceFactory {
  static async create<
    T extends keyof PrismaClient>(
    model: T,
    body: any,
    userId: string,
    schema?: ZodType<any>,
    tx?: Prisma.TransactionClient
  ) {
    const data = schema ? validate(schema, body) : body
    const delegate = getModel(model, tx) as any
    data.created_by = userId

    return await delegate.create({
      data,
    })
  }

  static async update<T extends keyof PrismaClient>(
    model: T,
    id: string,
    body: any,
    userId: string,
    schema?: ZodType<any>,
    tx?: Prisma.TransactionClient
  ) {
    const data = schema ? validate(schema, body) : body
    const delegate = getModel(model, tx) as any
    data.updated_by = userId

    const existingData = await delegate.count({ where: { id } })
    if (existingData < 1) throw new ResponseError('Data not found', 404)

    return await delegate.update({
      where: { id },
      data,
    })
  }

  static async getAll<T extends keyof PrismaClient>(
    model: T,
    query: any,
    include?: Prisma.Args<PrismaClient[T], 'findMany'>['include'],
    select?: Prisma.Args<PrismaClient[T], 'findMany'>['select']
  ) {
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit
    const sort = { id: 'desc' }
    delete query.page; delete query.limit; delete query.sort

    const where: any = { deleted_date: null }
    Object.keys(query).forEach(key => {
      if (Array.isArray(query[key])) {
        where[key] = { in: query[key] }
      } else if (key.endsWith('_id')) {
        where[key] = query[key]
      } else if (query[key] === 'true' || query[key] === 'false') {
        where[key] = query[key] === 'true'
      } else if (key === 'start_date') {
        if (where['created_date']) where['created_date'] = { ...where['created_date'], gte: query[key] }
        else where['created_date'] = { gte: query[key] }
      } else if (key === 'end_date') {
        if (where['created_date']) where['created_date'] = { ...where['created_date'], lte: query[key] }
        else where['created_date'] = { lte: query[key] }
      } else if (key === 'month_date') {
        where['created_date'] = queryMonth(query[key])
      } else {
        where[key] = { contains: query[key] }
      }
    })
    
    const delegate = getModel(model) as any

    const [total, data] = await Promise.all([
      delegate.count({ where }),
      ...[include ? delegate.findMany({
        where,
        take: limit,
        skip,
        orderBy: sort,
        include,
      }) : select ? delegate.findMany({
        where,
        take: limit,
        skip,
        orderBy: sort,
        select,
      }) : delegate.findMany({
        where,
        take: limit,
        skip,
        orderBy: sort,
      })]
    ])
    return { total, data }
  }

  static async getOne<T extends keyof PrismaClient>(
    model: T,
    id: string,
    include?: Prisma.Args<PrismaClient[T], 'findUnique'>['include'],
    select?: Prisma.Args<PrismaClient[T], 'findUnique'>['select']
  ) {
    const delegate = getModel(model) as any

    let data
    if (include) {
      data = await delegate.findUnique({
        where: { id },
        include,
      })
    } else if (select) {
      data = await delegate.findUnique({
        where: { id },
        select,
      })
    } else {
      data = await delegate.findUnique({
        where: { id },
      })
    }
    
    return data
  }

  static async delete<T extends keyof PrismaClient>(model: T, id: string, userId: string) {
    const data = await (prisma[model] as any).findUnique({ where: { id } })
    if (!data) throw new ResponseError('Data not found', 404)

    return await (prisma[model] as any).update({ where: { id }, data: { deleted_date: new Date(), deleted_by: userId } })
  }
}
