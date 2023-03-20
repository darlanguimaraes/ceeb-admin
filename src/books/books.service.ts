import { Book } from "@prisma/client";
import prisma from "../lib/prisma";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

export class BooksService {
  async create(book: CreateBookDto): Promise<Book> {
    try {
      return await prisma.book.create({
        data: { ...book },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(book: UpdateBookDto): Promise<Book> {
    console.log(book);
    try {
      return await prisma.book.update({
        where: { id: book.id },
        data: { ...book },
      });
    } catch (error) {
      throw error;
    }
  }
}
