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
    tx?: Prisma.TransactionClient,
    include?: Prisma.Args<PrismaClient[T], 'update'>['include']
  ) {
    const data = schema ? validate(schema, body) : body
    const delegate = getModel(model, tx) as any
    data.updated_by = userId

    const existingData = await delegate.count({ where: { id } })
    if (existingData < 1) throw new ResponseError('Data not found', 404)

    return await delegate.update({
      where: { id },
      data,
      include,
    })
  }

  static async getAll<T extends keyof PrismaClient>(
    model: T,
    query: URLSearchParams,
    include?: Prisma.Args<PrismaClient[T], 'findMany'>['include'],
    select?: Prisma.Args<PrismaClient[T], 'findMany'>['select']
  ) {
    const page = parseInt(query.get('page')!) || 1
    const limit = parseInt(query.get('limit')!) || 10
    const skip = (page - 1) * limit
    const search = query.get('search') ? JSON.parse(query.get('search')!) : {}
    const order = query.get('order')
    let orderBy: Prisma.Args<PrismaClient[T], 'findMany'>['orderBy'] = { id: 'desc' }
    console.log(search, 'search', typeof search)
    if (order) {
      const sort = order.split('-')

      orderBy = { [sort[0]]: sort[1] }
    }

    const where: Prisma.Args<PrismaClient[T], 'findMany'>['where'] = { deleted_date: null }
    Object.keys(search).forEach(key => {
      const dot = key.includes('.')

      if (Array.isArray(search[key])) {
        if (dot) {
          const fields = key.split('.');
          const lastField = fields.pop()!;

          let currentLevel = where;
          for (const field of fields) {
            if (!currentLevel[field]) {
              currentLevel[field] = {};
            }
            currentLevel = currentLevel[field];
          }

          currentLevel[lastField] = { in: search[key] };
        } else {
          where[key] = { in: search[key] }
        }
      } else if (key.endsWith('_id')) {
        where[key] = search[key]
      } else if (key.includes('-')) {
        const fields = key.split('-')

        where.OR = fields.map(f => ({ [f]: { contains: search[key] } }))

      } else if (typeof search[key] === 'boolean') {
        where[key] = search[key]
      } else if (key === 'start_date') {
        if (where['created_date']) where['created_date'] = { ...where['created_date'], gte: search[key] }
        else where['created_date'] = { gte: search[key] }
      } else if (key === 'end_date') {
        if (where['created_date']) where['created_date'] = { ...where['created_date'], lte: search[key] }
        else where['created_date'] = { lte: search[key] }
      } else if (key === 'month_date') {
        where['created_date'] = queryMonth(search[key])
      } else {
        where[key] = { contains: search[key] }
      }
    })

    const delegate = getModel(model) as any

    const [total, data] = await Promise.all([
      delegate.count({ where }),
      ...[include ? delegate.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include,
      }) : select ? delegate.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        select,
      }) : delegate.findMany({
        where,
        take: limit,
        skip,
        orderBy,
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

  static async count<T extends keyof PrismaClient>(model: T, id: string, tx?: Prisma.TransactionClient): Promise<number> {
    return await ((tx ?? prisma)[model] as any).count({ where: { id } })
  }

  static async getSequence(name: string, tx?: Prisma.TransactionClient) {
    return await (tx ?? prisma).sequence.findUnique({ where: { name } })
  }

  static async createSequence(data: Prisma.SequenceCreateInput, tx?: Prisma.TransactionClient) {
    return await (tx ?? prisma).sequence.create({ data })
  }

  static async updateSequence(id: string, data: Prisma.SequenceUpdateInput, tx?: Prisma.TransactionClient) {
    return await (tx ?? prisma).sequence.update({ where: { id }, data })
  }

  static async deleteSequence(id: string, tx?: Prisma.TransactionClient) {
    return await (tx ?? prisma).sequence.delete({ where: { id } })
  }
}
