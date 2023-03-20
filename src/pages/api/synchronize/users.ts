import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { runMiddleware } from "../../../util/corsUtils";
import validateToken from "../../../util/validateToken";

interface UserRemote {
  name: string;
  username: string;
  email: string;
  password: string;
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
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        username: true,
      }
    });
    return response.json({ users });
  } else if (method === "POST") {
    const data = JSON.parse(request.body) as Array<UserRemote>;
    if (data.length > 0) {
      for (const user of data) {
        if (user.remoteId) {
          await prisma.user.update({
            where: { id: user.remoteId},
            data: {
              name: user.name,
              email: user.email,
              username: user.username,
              password: user.password,
            }
          });
        } else {

          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              username: user.username,
              password: user.password,
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
