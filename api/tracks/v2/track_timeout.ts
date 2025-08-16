import type { IncomingMessage, ServerResponse } from 'http';

let tracks = [
  {
    id: '3qQbVL4efGUc66eQ4bL2p4',
    name: '三天三夜',
    start: '0:00',
    duration: 50,
  },
  {
    id: '6Y6UPy5H2O2e3T63bS7K0A',
    name: 'Summertime',
    start: '0:10',
    duration: 50,
  },
];

function handler(req: IncomingMessage, res: ServerResponse) {
  const authHeader =
    req.headers['authorization'] || req.headers['Authorization'];

  if (authHeader) {
    const maskedAuth =
      authHeader.length > 10
        ? `${authHeader.slice(0, 5)}...${authHeader.slice(-5)}`
        : authHeader;
    console.log('Authorization header:', maskedAuth);
  } else {
    console.log('No Authorization header provided');
  }

  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tracks));
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newTracks = JSON.parse(body);
        tracks = newTracks;
        console.log('Tracks updated successfully:', newTracks);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Tracks updated successfully' }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    res.end('Method Not Allowed');
  }
}

module.exports = handler;
