import { NextApiRequest, NextApiResponse } from "next";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const method = request.method;
  if (method === "POST") {
    try {
      const { username, password } = request.body;
      const user = await prisma.user.findFirst({
        where: {
          username: username.toString(),
        },
      });
      if (user) {
        const passwordValid = await bcrypt.compare(
          password.toString(),
          user.password
        );
        if (!passwordValid) {
          return response.status(401).json({ message: "Credentials invalid" });
        }

        delete user.password;
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken.sign({ user, secret }, secret, {
          expiresIn: "300d",
        });

        response.json({ user, token });
      } else {
        response.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      return response.status(500).json({ message: "Error" });
    }
  } else {
    response.status(500).json({ message: "Not allowed" });
  }
}
