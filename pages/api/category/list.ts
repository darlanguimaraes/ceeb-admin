import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import validate from "../../../util/validateRequest";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!(await validate(request, response))) {
    return response.status(401).json({ message: "Authorization denied" });
  }

  const method = request.method;

  if (method === "GET") {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: [
        {
          name: "desc",
        },
      ],
    });
    response.json(categories);
  }  else {
    response.status(500).json({ message: "Not allowed" });
  }
}