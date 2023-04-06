import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

import { PaymentType } from "../../../util/payments";

interface Invoice {
  date: Date;
  category: string;
  credit: boolean;
  payment_type: number;
  quantity: number;
  value: number;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const method = request.method;

  if (method === "GET") {
    const { initialDate, finalDate } = request.query;
    const results = await prisma.invoice.findMany({
      where: {
        AND: [
          { date: { gte: dayjs(initialDate.toString()).toDate() } },
          { date: { lte: dayjs(finalDate.toString()).toDate() } },
        ],
      },
      select: {
        date: true,
        quantity: true,
        value: true,
        credit: true,
        paymentType: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const lines = results.map((invoice) => {
      const value =
        invoice.quantity.toNumber() *
        invoice.value.toNumber() *
        (invoice.credit ? 1 : -1);
      return `${dayjs(invoice.date).format("DD/MM/YYYY")};${
        invoice.category.name
      };${invoice.credit ? "Entrada" : "Saída"};${invoice.paymentType};${
        invoice.quantity
      };${invoice.value};${value};`;
    });
    const header =
      "Data;Categoria;Tipo;Tipo de Pagamento;Quantidade;Valor;Total;";
    const csv = header + "\n" + lines.join("\n");
    response.json({ report: removerAcentos(csv) });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}

const removerAcentos = (texto: string): string => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
