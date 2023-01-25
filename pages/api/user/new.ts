import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
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
  if (method === "POST") {
    try {
      const { name, username, password, email } = request.body;

      if (!name || !username || !password || password.length < 5) {
        return response.status(500).json({ message: "Invalid data " });
      }

      const findUser = await prisma.user.findFirst({
        where: { username },
      });
      if (findUser) {
        return response.status(500).json({ message: "User already exists" });
      }
      const user = {
        name,
        username,
        email,
        password: await bcrypt.hash(password, 8),
      };
      await prisma.user.create({
        data: user,
      });
      return response.status(200).json({ message: "success" });
    } catch (error) {
      response.status(500).json({ message: "Error" });
    }
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
