import { registrationHandler } from './new';

export default async function handler(req, res) {
  return registrationHandler(req, res);
}
