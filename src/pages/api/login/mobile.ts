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
    if (!username || !password) {
      return response.status(500).json({ message: "Invalid data" });
    }
    const user = await prisma.user.findFirst({
      where: {
        username,
        password,
      },
    });
    if (!user) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    return response.send({ user, token });
  }
}

function generateToken(user) {
  const token = jsonwebtoken.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return token;
}
