import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validateToken from "../../../util/validateToken";

interface LendingRemote {
  id: string;
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
  await runMiddleware(request, response);

  const method = request.method;
  const { auth } = request.query;
  if (!validateToken(auth)) {
    return response.status(401).json({ message: "error" });
  }

  if (method === "GET") {
    const lendings = await prisma.lending.findMany({
      select: {
        id: true,
        book: {
          select: {
            id: true,
            name: true,
            code: true,
            edition: true,
          },
        },
        code: true,
        date: true,
        deliveryDate: true,
        expectedDate: true,
        reader: {
          select: {
            id: true,
            name: true,
          },
        },
        returned: true,
      },
    });
    return response.json({ lendings });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<LendingRemote>;
    const newData = [];
    if (data.length > 0) {
      for (const lending of data) {
        if (lending.remoteId) {
          await prisma.lending.update({
            where: { id: lending.remoteId },
            data: {
              bookId: lending.bookId,
              code: lending.code,
              date: new Date(lending.date),
              deliveryDate: new Date(lending.deliveryDate),
              expectedDate: lending.expectedDate
                ? new Date(lending.expectedDate)
                : null,
              readerId: lending.readerId,
              returned: lending.returned,
            },
          });
        } else {
          const newLending = await prisma.lending.create({
            data: {
              bookId: lending.bookId,
              code: lending.code,
              date: new Date(lending.date),
              deliveryDate: new Date(lending.deliveryDate),
              expectedDate: lending.expectedDate
                ? new Date(lending.expectedDate)
                : null,
              readerId: lending.readerId,
              returned: lending.returned,
            },
          });
          newData.push({
            id: lending.id,
            remoteId: newLending.id,
          });
        }
      }
    }
    return response.json({ newData });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
