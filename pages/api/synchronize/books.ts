import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validateToken from "../../../util/validateToken";

interface BookRemote {
  id: string;
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
  await runMiddleware(request, response);
  
  const { auth } = request.query;
  if (!validateToken(auth)) {
    return response.status(401).json({ message: "error" });
  }

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
        edition: true,
      },
    });
    return response.json({ books });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<BookRemote>;
    const newData = [];
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
          const newBook = await prisma.book.create({
            data: {
              name: book.name,
              author: book.author,
              code: book.code,
              borrow: book.borrow,
              edition: book.edition,
              writer: book.writer,
            },
          });
          newData.push({
            id: book.id,
            remoteId: newBook.id,
          });
        }
      }
    }
    return response.json({ newData });
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
