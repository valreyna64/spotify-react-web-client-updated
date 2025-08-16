// api/hello.ts
import type { IncomingMessage, ServerResponse } from 'http';

function handler(req: IncomingMessage, res: ServerResponse) {
  // 從 headers 取得 Authorization
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  // 安全起見只顯示前後幾個字元
  if (authHeader) {
    const maskedAuth = authHeader.length > 10
      ? `${authHeader.slice(0, 5)}...${authHeader.slice(-5)}`
      : authHeader;
    console.log('Authorization header:', maskedAuth);
  } else {
    console.log('No Authorization header provided');
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Hello from TS + Node types (CJS export)' }));
}

// 關鍵：用 CommonJS 匯出
module.exports  = handler;
// 或： (req: IncomingMessage, res: ServerResponse) => {...}; 然後 module.exports = handler;
