import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import validate from "../../../util/validateRequest";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // if (!(await validate(request, response))) {
  //   return response.status(401).json({ message: "Authorization denied" });
  // }

  const method = request.method;

  if (method === 'GET') {
    console.log(request.body);
    return response.json({message: 'ola get'});
  }else  if (method === "POST") {
    console.log(request.body);
    return response.json({message: 'ola'});
  }  else {
    response.status(500).json({ message: "Not allowed" });
  }
}
