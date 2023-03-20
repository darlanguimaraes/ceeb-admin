import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parseCookies } from "./cookieUtil";

export default async function validate(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<boolean> {
  const data = parseCookies(request);
  const token = data.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return false;
  }

  return true;
}
