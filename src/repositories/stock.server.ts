import { prisma } from "@/lib/prisma"
import { StockBody, StockIOBody } from "@/types/stock"
import { Prisma } from "@prisma/client"

export const getStockByItemNBranch = async (item_id: string, branch_id: string) => {
  return await prisma.stock.findFirst({
    where: {
      item_id,
      branch_id,
    },
  })
}

export const createStock = async (data: StockBody, tx?: Prisma.TransactionClient) => {
  return await (tx ?? prisma).stock.create({
    data,
    include: {
      branch: true,
      item: true,
    },
  })
}

export const incStock = async (stock_id: string, qty: number, tx?: Prisma.TransactionClient) => {
  return await (tx ?? prisma).stock.update({
    where: {
      id: stock_id
    },
    data: {
      qty: {
        increment: qty,
      },
    },
    include: {
      branch: true,
      item: true,
    },
  })
}

export const decStock = async (stock_id: string, qty: number, tx?: Prisma.TransactionClient) => {
  return await (tx ?? prisma).stock.update({
    where: {
      id: stock_id
    },
    data: {
      qty: {
        decrement: qty,
      },
    },
  })
}

export const createStockIO = async (data: StockIOBody, tx?: Prisma.TransactionClient) => {
  return await (tx ?? prisma).stockIO.create({
    data,
  })
}

export const createManyStock = async (data: StockBody[], tx?: Prisma.TransactionClient) => {
  return await (tx ?? prisma).stock.createMany({
    data,
  })
}

export const getStockByNotBranch = async (branch_id: string, tx?: Prisma.TransactionClient) => {
  return await (tx ?? prisma).stock.findMany({
    where: {
      NOT: {
        branch_id,
      },
    },
    distinct: ['item_id']
  })
}