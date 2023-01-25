import cookie from "cookie"

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
}

export function validateCookie(req) {
  const data = parseCookies(req);
  if (Object.keys(data).length === 0 && data.constructor === Object) {
    return false;
  }
  return false;
}