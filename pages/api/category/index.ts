import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import validate from "../../../util/validateRequest";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {

  if (!await validate(request, response)) {
    return response.status(401).json({ message: "Authorization denied" });
  }

  const method = request.method;

  if (method === "GET") {
    const { page } = request.query;
    const skip = page && +page ? (+page - 1) * 10 : 0;
    const total = await prisma.category.count();
    const result = await prisma.category.findMany({
      skip,
      take: 10,
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
    response.json({
      categories: result,
      total,
    });
  } else if (method === "POST") {
    const { name } = request.body;
    const result = await prisma.category.create({
      data: {
        name,
      },
    });
    response.json(result);
  } else if (method === "PUT") {
    const { id, name } = request.body;
    const result = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });
    response.json(result);
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
