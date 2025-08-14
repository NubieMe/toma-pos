import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { ServiceFactory } from "@/services/service-factory";
import { Product } from "@/types/product";
import { Session } from "@/types/session";
import { Transaction } from "@/types/transaction";
import { errorHandler, romanizeMonth } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const body = (await req.json()) as Transaction
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session
    const { products, charges, ...transaction } = body

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "Product tidak boleh kosong" }, { status: 400 })
    }

    const branch = await ServiceFactory.getOne('branch', transaction.branch_id)
    if (!branch) {
      return NextResponse.json({ message: "Branch tidak ditemukan" }, { status: 404 })
    }

    const stocksId = products.map((product: Product) => product.stock_id)

    const stocks = await prisma.stock.findMany({
      where: {
        id: {
          in: stocksId
        }
      }
    })

    let total_net = 0, total_tax = 0, total_sub = 0;
    for (const product of products!) {

      const stock = stocks.find(s => s.id === product.stock_id)
      if (!stock) {
        throw new ResponseError("Stock tidak ditemukan", 404)
      }

      product.price = stock.price;
      const prices = product.price * product.qty;
      if (product.discount_percent) product.discount_amount = prices / 100 * product.discount_percentage;
      else product.discount_percentage = product.discount_amount / prices * 100;

      product.net_price = prices - product.discount_amount;
      total_net += product.net_price;

      product.ppn_amount = product.net_price / 100 * product.ppn_percentage;
      total_tax += product.ppn_amount;
      product.subtotal = product.net_price + product.ppn_amount;
      total_sub += product.subtotal;
    }

    transaction.net_price = total_net;
    transaction.total_ppn = total_tax;
    transaction.subtotal = total_sub;
    transaction.total = total_sub + total_tax;

    if (charges?.length) {
      for (const charge of charges) {
        if (charge.percent) charge.amount = total_sub / 100 * charge.percentage;
        else charge.percentage = charge.amount / total_sub * 100;

        transaction.total += charge.amount;
      }
    }

    const data = await prisma.$transaction(async tx => {
      let seq = await ServiceFactory.getSequence(transaction.branch_id, tx)

      if (!seq) {
        seq = await ServiceFactory.createSequence(
          {
            name: transaction.branch_id,
            year,
            month
          },
          tx
        )
      } else if (seq.year !== year || seq.month !== month) {
        seq.year = year
        seq.month = month
        seq.number = 0
      }
      seq.number++

      transaction.code = `INV/${branch.code}/${year.toString().substring(2)}/${romanizeMonth(month)}/${seq.number.toString().padStart(5, '0')}`

      const data = await ServiceFactory.create('transaction', transaction, user.id, undefined, tx)
      await ServiceFactory.updateSequence(transaction.branch_id, seq, tx)
      return data
    })

    return NextResponse.json({ data, message: "Transaksi berhasil" })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }  
}