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
    const { page, name } = request.query;
    const skip = page && +page ? (+page - 1) * 10 : 0;

    const where = {} as Prisma.ReaderWhereInput;
    if (name) {
      where.name = {
        contains: name+'',
        mode: 'insensitive'
      };
    }

    const total = await prisma.reader.count({
      where,
    });
    const readers = await prisma.reader.findMany({
      where,
      skip,
      take: 10,
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
    return response.json({
      total,
      readers,
    });
  } else if (method === "POST") {
    const result = await prisma.reader.create({
      data: request.body,
    });
    return response.json(result);
  } else if (method === "PUT") {
    const result = await prisma.reader.update({
      where: { id: request.body.id },
      data: request.body,
    });
    return response.json(result);
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
