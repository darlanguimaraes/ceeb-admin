import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export default async function validate(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<boolean> {
  const mobile = request.headers.mobile;

  if (!mobile) {
    const session = await unstable_getServerSession(
      request,
      response,
      authOptions
    );

    if (!session) return false;
  } else {
    const authHeader = request.headers.authorization;
    if (!authHeader) return false;

    const [, token] = authHeader.split(" ");

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return false;
    }
  }
  return true;
}
