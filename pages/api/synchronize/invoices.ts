import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validate from "../../../util/validateRequest";

interface InvoiceRemote {
  name: string;
  date: Date;
  quantity: number;
  value: number;
  credit: boolean;
  paymentType?: string;
  categoryId: string;
  lendingId?: string;
  remoteId?: string;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // if (!(await validate(request, response))) {
  //   return response.status(401).json({ message: "Authorization denied" });
  // }
  await runMiddleware(request, response);

  const method = request.method;

  if (method === "GET") {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        date: true,
        categoryId: true,
        credit: true,
        lendingId: true,
        paymentType: true,
        quantity: true,
        value: true,
      },
    });
    return response.json({ invoices });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<InvoiceRemote>;
    if (data.length > 0) {
      for (const invoice of data) {
        if (invoice.remoteId) {
          await prisma.invoice.update({
            where: { id: invoice.remoteId },
            data: {
              date: invoice.date,
              categoryId: invoice.categoryId,
              credit: invoice.credit,
              lendingId: invoice.lendingId,
              paymentType: invoice.paymentType,
              quantity: invoice.quantity,
              value: invoice.value,
            },
          });
        } else {
          await prisma.invoice.create({
            data: {
              date: invoice.date,
              categoryId: invoice.categoryId,
              credit: invoice.credit,
              lendingId: invoice.lendingId,
              paymentType: invoice.paymentType,
              quantity: invoice.quantity,
              value: invoice.value,
            },
          });
        }
      }
    }
    return response.json({ message: "ok" });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
