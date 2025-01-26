import { loginHandler } from './new';

export default async function handler(req, res) {
  return loginHandler(req, res);
}
