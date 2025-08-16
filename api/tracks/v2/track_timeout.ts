import type { IncomingMessage, ServerResponse } from 'http';

function handler(req: IncomingMessage, res: ServerResponse) {
  const tracks = [
    {
      name: '三天三夜',
      start: '0:00',
      duration: 50
    },
    {
      name: 'Summertime',
      start: '0:10',
      duration: 50
    }
  ];
  res.statusCode = 200;

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


  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(tracks));
}

module.exports = handler;
