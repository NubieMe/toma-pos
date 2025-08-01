import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { incStock, createStock, createStockIO, getStockByItemNBranch, decStock } from "@/repositories/stock.server";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { StockIOBody } from "@/types/stock";
import { errorHandler } from "@/utils/helper";
import { IOType, Stock } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { data, total } = await ServiceFactory.getAll('stock', req.nextUrl.searchParams, { item: true, branch: true })

    return NextResponse.json({ data, total })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const item = await ServiceFactory.getOne('item', body.item_id)
    if (!item) {
      return NextResponse.json({ message: "Item tidak ditemukan" }, { status: 404 })
    }

    const branch = await ServiceFactory.getOne('branch', body.branch_id)
    if (!branch) {
      return NextResponse.json({ message: "Branch tidak ditemukan" }, { status: 404 })
    }

    const stock = await getStockByItemNBranch(body.item_id, body.branch_id)

    const data = await prisma.$transaction(async tx => {
      const type = body.type as IOType
      let upserted: Stock;

      const ioBody: StockIOBody = {
        type,
        qty: body.qty,
        price: body.price,
        stock_id: '',
        created_by: user.id,
        status: 'success',
        note: body.note,
      }

      if (type === 'purchase' || type === 'production') {
        if (stock) {
          upserted = await incStock(stock.id, body.qty, tx)
        } else {
          upserted = await createStock(
            {
              item_id: item.id,
              branch_id: branch.id,
              vendible: item.vendible,
              qty: body.qty,
              created_by: user.id,
              price: 0,
            },
            tx,
          )
        }

        ioBody.stock_id = upserted.id
        if (type === 'production') ioBody.price = 0
      } else if (type === 'consumption' || type === 'defect' || type === 'return' || type === 'transfer') {
        if (stock) {
          upserted = await decStock(stock.id, body.qty, tx)
        } else {
          throw new ResponseError("Stock tidak ditemukan, silahkan tambahkan stock terlebih dahulu", 404)
        }

        ioBody.stock_id = upserted.id
        if (type === 'transfer') {
          const toBranch = await ServiceFactory.getOne('branch', body.to_id)
          if (!toBranch) throw new ResponseError('Branch tujuan tidak ditemukan', 404)

          const toStock = await getStockByItemNBranch(body.item_id, body.to_id)
          if (toStock) {
            ioBody.to_id = toStock.id
          } else {
            const created = await createStock(
              {
                item_id: item.id,
                branch_id: toBranch.id,
                vendible: item.vendible,
                qty: 0,
                created_by: user.id,
                price: 0,
              },
              tx,
            )

            ioBody.to_id = created.id
          }
          ioBody.status = 'pending'
        } else {
          ioBody.price = 0
        }
      } else if (type === 'adjustment') {
        if (stock) {
          upserted = await ServiceFactory.update('stock', stock.id, { qty: body.qty }, user.id, undefined, tx, { item: true, branch: true })
        } else {
          upserted = await createStock(
            {
              item_id: item.id,
              branch_id: branch.id,
              vendible: item.vendible,
              qty: body.qty,
              created_by: user.id,
              price: 0,
            },
            tx,
          )
        }

        ioBody.stock_id = upserted.id
        ioBody.price = 0
      } else {
        throw new ResponseError("Type tidak ditemukan", 404)
      }

      await createStockIO(
        ioBody,
        tx,
      )

      return upserted
    })

    return NextResponse.json({ data, message: 'Stock berhasil diperbarui' })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }  
}
