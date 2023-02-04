import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validateToken from "../../../util/validateToken";

interface CategoryRemote {
  id: string;
  name: string;
  remoteId?: string;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await runMiddleware(request, response);
  
  const method = request.method;
  const { auth } = request.query;
  if (!validateToken(auth)) {
    return response.status(401).json({ message: "error" });
  }

  if (method === "GET") {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return response.json({ categories });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<CategoryRemote>;
    const listForReturn = [];
    if (data.length > 0) {
      for (const category of data) {
        if (category.remoteId) {
          await prisma.category.update({
            where: { id: category.remoteId },
            data: {
              name: category.name,
            },
          });
        } else {
          const newCategory = await prisma.category.create({
            data: {
              name: category.name,
            },
          });
          listForReturn.push({
            id: category.id,
            remoteId: newCategory.id,
          });
        }
      }
    }
    return response.json({ newData: listForReturn });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
