import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { errorHandler } from "@/utils/helper";
import { StatusType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session;
    const existing = await ServiceFactory.getOne('stockIO', id, { stock: true, to: true });

    if (!existing) {
      return NextResponse.json({ message: "Stock tidak ditemukan" }, { status: 404 });
    }

    const status = body.status as StatusType;
    if (status === 'success') {
      if (existing.to.branch_id !== user.branch.id) {
        return NextResponse.json({ message: "Anda tidak diizinkan menerima stock ini" }, { status: 403 });
      }

      await prisma.stockIO.update({
        where: {
          id: existing.id,
        },
        data: {
          status,
          updated_by: user.id,
          to: {
            update: {
              qty: {
                increment: existing.qty,
              },
              updated_by: user.id,
            }
          }
        }
      })
    } else if (status === 'cancel') {
      if (existing.stock.branch_id !== user.branch.id) {
        return NextResponse.json({ message: "Anda tidak diizinkan membatalkan transfer stock ini" }, { status: 403 });
      }

      await prisma.stockIO.update({
        where: {
          id: existing.id,
        },
        data: {
          status,
          updated_by: user.id,
          stock: {
            update: {
              qty: {
                increment: existing.qty
              },
              updated_by: user.id,
            }
          }
        }
      })
    } else if (status === 'failed') {
      if (!body.note) {
        return NextResponse.json({ message: 'Note tidak boleh kosong' }, { status: 400 })
      }

      const note = existing.note ? `${existing.note}\n\nfailed note: ${body.note}` : body.note

      await prisma.stockIO.update({
        where: {
          id: existing.id,
        },
        data: {
          status,
          updated_by: user.id,
          note,
        }
      })
    } else {
      return NextResponse.json({ message: "Status tidak valid" }, { status: 400 });
    }

    return NextResponse.json({ message: "Stock berhasil dikonfirmasi" });
  } catch (error) {
    return errorHandler(error as ResponseError);
  }
}