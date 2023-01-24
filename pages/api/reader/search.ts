import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import validate from "../../../util/validateRequest";

interface Filter {
  id?: string,
  name?: {
    contains: string,
  }
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
    const {  name } = request.query;

    const where = {} as Filter;
    if (name) {
      where.name = {
        contains: name+'',
      };
    }

    const readers = await prisma.reader.findMany({
      where,
      orderBy: [
        {
          name: "desc",
        },
      ],
    });
    return response.json({
      readers,
    });
  }  else {
    response.status(500).json({ message: "Not allowed" });
  }
}
