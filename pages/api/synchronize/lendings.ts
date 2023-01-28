import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validate from "../../../util/validateRequest";

interface LendingRemote {
  name: string;
  bookId: string;
  readerId: string;
  date: Date;
  expectedDate: Date;
  deliveryDate?: Date;
  code: string;
  returned: boolean;
  remoteId?: string;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // if (!(await validate(request, response))) {
  //   return response.status(401).json({ message: "Authorization denied" });
  // }
  await runMiddleware(request, response);

  const method = request.method;

  if (method === "GET") {
    const lendings = await prisma.lending.findMany({
      select: {
        id: true,
        book: {
          select: {
            id: true,
            name: true,
          }
        },
        code: true,
        date: true,
        deliveryDate: true,
        expectedDate: true,
        reader: {
          select: {
            id: true,
            name: true,
          }
        },
        returned: true,
      },
    });
    return response.json({ lendings });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<LendingRemote>;
    if (data.length > 0) {
      for (const lending of data) {
        if (lending.remoteId) {
          await prisma.lending.update({
            where: { id: lending.remoteId },
            data: {
              bookId: lending.bookId,
              code: lending.code,
              date: lending.date,
              deliveryDate: lending.deliveryDate,
              expectedDate: lending.expectedDate,
              readerId: lending.readerId,
              returned: lending.returned,
            },
          });
        } else {
          await prisma.lending.create({
            data: {
              bookId: lending.bookId,
              code: lending.code,
              date: lending.date,
              deliveryDate: lending.deliveryDate,
              expectedDate: lending.expectedDate,
              readerId: lending.readerId,
              returned: lending.returned,
            },
          });
        }
      }
    }
    return response.json({ message: "ok" });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
