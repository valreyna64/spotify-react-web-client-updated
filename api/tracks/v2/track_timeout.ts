import type { IncomingMessage, ServerResponse } from 'http';

function handler(req: IncomingMessage, res: ServerResponse) {
  const tracks = [
    {
      name: '三天三夜',
      start: '0:00',
      duration: 50
    }
  ];
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(tracks));
}

module.exports = handler;
