import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import validate from "../../../util/validateRequest";

interface Filter {
  id?: string,
  name?: {
    contains: string,
  }
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!(await validate(request, response))) {
    return response.status(401).json({ message: "Authorization denied" });
  }

  const method = request.method;

  if (method === "GET") {
    const { page, name } = request.query;
    const skip = page && +page ? (+page - 1) * 10 : 0;

    const where = {} as Filter;
    if (name) {
      where.name = {
        contains: name+'',
      };
    }

    const total = await prisma.book.count({
      where,
    });
    const books = await prisma.book.findMany({
      where,
      skip,
      take: 10,
      orderBy: [
        {
          name: "desc",
        },
      ],
    });
    return response.json({
      total,
      books,
    });
  } else if (method === "POST") {
    const result = await prisma.book.create({
      data: request.body,
    });
    return response.json(result);
  } else if (method === "PUT") {
    const result = await prisma.book.update({
      where: { id: request.body.id },
      data: request.body,
    });
    return response.json(result);
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}