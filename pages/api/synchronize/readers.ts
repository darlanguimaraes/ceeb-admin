import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validate from "../../../util/validateRequest";

interface ReaderRemote {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  email?: string;
  openLoan: boolean;
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
    const readers = await prisma.reader.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        email: true,
        openLoan: true,
      },
    });
    return response.json({ readers });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<ReaderRemote>;
    if (data.length > 0) {
      for (const reader of data) {
        if (reader.remoteId) {
          await prisma.reader.update({
            where: { id: reader.remoteId},
            data: {
              name: reader.name,
              address: reader.address,
              city: reader.city,
              email: reader.email,
              openLoan: reader.openLoan,
            }
          });
        } else {
          await prisma.reader.create({
            data: {
              name: reader.name,
              address: reader.address,
              city: reader.city,
              email: reader.email,
              openLoan: reader.openLoan,
            }
          });
        }
      }
    }
    return response.json({ message: "ok" });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
