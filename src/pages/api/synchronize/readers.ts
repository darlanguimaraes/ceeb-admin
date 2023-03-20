import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validateToken from "../../../util/validateToken";

interface ReaderRemote {
  id: string;
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

  await runMiddleware(request, response);
  const method = request.method;
  const { auth } = request.query;
  if (!validateToken(auth)) {
    return response.status(401).json({ message: "error" });
  }

  if (method === "GET") {
    const readers = await prisma.reader.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        email: true,
        openLoan: true,
      },
    });
    return response.json({ readers });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<ReaderRemote>;
    const newData = [];
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
              phone: reader.phone,
              openLoan: reader.openLoan,
            }
          });
        } else {
          const newReader = await prisma.reader.create({
            data: {
              name: reader.name,
              address: reader.address,
              city: reader.city,
              email: reader.email,
              phone: reader.phone,
              openLoan: reader.openLoan,
            }
          });
          newData.push({
            id: reader.id,
            remoteId: newReader.id,
          });
        }
      }
    }
    return response.json({ newData });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
