import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import validate from "../../../util/validateRequest";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (!(await validate(request, response))) {
    return response.status(401).json({ message: "Authorization denied" });
  }

  const method = request.method;

  if (method === "GET") {
    const { name } = request.query;

    const where = {} as Prisma.BookWhereInput;
    if (name) {
      where.OR = [
        {
          name: {
            contains: ''+name,
            mode: 'insensitive',
          }
        },
        {
          author: {
            contains: ''+name,
            mode: 'insensitive',
          }
        },
        {
          code: {
            contains: ''+name,
            mode: 'insensitive',
          }
        },
        {
          edition: {
            contains: ''+name,
            mode: 'insensitive',
          }
        }
      ]
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
    return response.json({
      books,
    });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
