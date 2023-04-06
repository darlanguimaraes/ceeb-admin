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
    const { page } = request.query;
    const skip = page && +page ? (+page - 1) * 10 : 0;

    const total = await prisma.invoice.count();
    const invoices = await prisma.invoice.findMany({
      skip,
      take: 10,
      include: {
        category: true,
      },
      orderBy: [
        {
          date: "desc",
        },
      ],
    });
    return response.json({ invoices, total });
  } else if (method === "POST") {
    try {
      const invoice = request.body;
      await prisma.invoice.create({
        data: invoice,
      });
      response.json({ message: "Success" });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: error });
    }
  } else if (method === "PUT") {
    try {
      const { id } = request.body;
      await prisma.invoice.update({
        where: { id },
        data: request.body,
      });

      response.json({ message: "Success" });
    } catch (error) {
      response.status(500).json({ message: error });
    }
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
