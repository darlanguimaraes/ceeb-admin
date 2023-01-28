import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validate from "../../../util/validateRequest";

interface BookRemote {
  name: string;
  author: string;
  writer?: string;
  code: string;
  borrow: boolean;
  edition?: string;
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
    const books = await prisma.book.findMany({
      select: {
        id: true,
        name: true,
        author: true,
        borrow: true,
        code: true,
        writer: true,
        // edition: true,
      },
    });
    return response.json({ books });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<BookRemote>;
    if (data.length > 0) {
      for (const book of data) {
        if (book.remoteId) {
          await prisma.book.update({
            where: { id: book.remoteId},
            data: {
              name: book.name,
              author: book.author,
              code: book.code,
              borrow: book.borrow,
              edition: book.edition,
              writer: book.writer,
            }
          });
        } else {
          await prisma.book.create({
            data: {
              name: book.name,
              author: book.author,
              code: book.code,
              borrow: book.borrow,
              edition: book.edition,
              writer: book.writer,
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
