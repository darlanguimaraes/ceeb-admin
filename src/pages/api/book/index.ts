import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { BooksService } from "../../../books/books.service";
import { CreateBookDto } from "../../../books/dto/create-book.dto";
import { UpdateBookDto } from "../../../books/dto/update-book.dto";
import prisma from "../../../lib/prisma";

import validate from "../../../util/validateRequest";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!(await validate(request, response))) {
    return response.status(401).json({ message: "Authorization denied" });
  }
  const bookService = new BooksService();
  const method = request.method;

  if (method === "GET") {
    const { page, name } = request.query;
    const skip = page && +page ? (+page - 1) * 10 : 0;

    const where = {} as Prisma.BookWhereInput;
    if (name) {
      where.name = {
        contains: name+'',
        mode: 'insensitive',
      };
    }

    const total = await prisma.book.count({
      where,
    });
    const books = await prisma.book.findMany({
      where,
      skip,
      take: 10,
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
    return response.json({
      total,
      books,
    });
  } else if (method === "POST") {
    const data = request.body;
    
    const bookDto = new CreateBookDto();
    bookDto.author = data.author;
    bookDto.borrow = false,
    bookDto.code = data.code;
    bookDto.edition = data.edition;
    bookDto.name = data.name;
    bookDto.writer = data.writer;
    bookDto.sync = false;
    
    const book = await bookService.create(bookDto);
    return response.json(book);
  } else if (method === "PUT") {
    const data = request.body;
    
    const bookDto = new UpdateBookDto();
    bookDto.id = data.id;
    bookDto.author = data.author;
    bookDto.borrow = false,
    bookDto.code = data.code;
    bookDto.edition = data.edition;
    bookDto.name = data.name;
    bookDto.writer = data.writer;
    bookDto.sync = false;
    
    const book = await bookService.update(bookDto);

    return response.json(book);
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}