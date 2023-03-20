import jwt from "jsonwebtoken";

export default function validateToken(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}
