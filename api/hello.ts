import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  res.statusCode = 200;
  res.end('Hello world');
}
