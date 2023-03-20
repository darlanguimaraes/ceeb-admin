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
    const {  name } = request.query;

    const where = {} as Prisma.ReaderWhereInput;
    if (name) {
      where.name = {
        contains: name+'',
        mode: 'insensitive'
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
