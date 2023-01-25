import { Lending } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import validate from "../../../util/validateRequest";

interface Filter {
  returned: boolean;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (!(await validate(request, response))) {
    return response.status(401).json({ message: "Authorization denied" });
  }

  const method = request.method;

  if (method === "GET") {
    const { page, open } = request.query;
    const skip = page && +page ? (+page - 1) * 10 : 0;

    const where = {} as Filter;
    if (open == "true") {
      where.returned = false;
    }
    const total = await prisma.lending.count({ where });
    const lendings = await prisma.lending.findMany({
      where,
      skip,
      take: 10,
      include: {
        book: true,
        reader: true,
      },
      orderBy: [
        {
          deliveryDate: "asc",
        },
      ],
    });
    return response.json({
      total,
      lendings,
    });
  } else if (method === "POST") {
    const data = request.body;
    const lending = {
      readerId: data.readerId,
      bookId: data.bookId,
      date: new Date(data.date),
      expectedDate: new Date(data.expectedDate),
    } as Lending;
    const result = await prisma.lending.create({
      data: lending,
    });
    await prisma.book.update({
      where: { id: data.bookId },
      data: { borrow: true },
    });
    await prisma.reader.update({
      where: { id: data.readerId },
      data: { openLoan: true },
    });
    return response.json(result);
  } else if (method === "PUT") {
    const lending = request.body;
    lending.deliveryDate = new Date();
    lending.returned = true;
    delete lending.book;
    delete lending.reader;

    const result = await prisma.lending.update({
      where: { id: lending.id },
      data: lending,
    });

    await prisma.book.update({
      where: { id: lending.bookId },
      data: { borrow: false },
    });
    await prisma.reader.update({
      where: { id: lending.readerId },
      data: { openLoan: false },
    });

    return response.json(result);
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
