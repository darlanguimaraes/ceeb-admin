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
  const { id } = request.query;

  if (method === "GET") {
    const category = await prisma.category.findFirst({
      where: { id: id.toString() },
      select: {
        id: true,
        name: true,
      },
    });
    response.json(category);
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
