import { validateCookieHandler } from './new';

export default async function handler(req, res) {
  return validateCookieHandler(req, res);
}
