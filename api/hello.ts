// api/hello.ts
import type { IncomingMessage, ServerResponse } from 'http';

function handler(req: IncomingMessage, res: ServerResponse) {
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Hello from TS + Node types (CJS export)' }));
}

// 關鍵：用 CommonJS 匯出
module.exports  = handler;
// 或： (req: IncomingMessage, res: ServerResponse) => {...}; 然後 module.exports = handler;
