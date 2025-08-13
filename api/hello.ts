import type { IncomingMessage, ServerResponse } from 'http';

module.exports = function handler(req: IncomingMessage, res: ServerResponse): void {
  res.statusCode = 200;
  res.end('Hello world');
};
