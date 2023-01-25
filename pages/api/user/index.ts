import { NextApiRequest, NextApiResponse } from "next";
import jsonwebtoken from "jsonwebtoken";
import prisma from "../../../lib/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const method = request.method;
  if (method === "POST") {
    const { username, password } = request.body;
    const user = await prisma.user.findFirst({
      where: {
        username: username.toString(),
        password: password.toString(),
      },
    });
    if (user) {
      const secret = process.env.JWT_SECRET;
      const token = jsonwebtoken.sign({ user, secret }, secret, {
        expiresIn: "300d",
      });

      response.json({user, token});
    } else {
      response.status(401).json({ message: "User not found" });
    }
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
