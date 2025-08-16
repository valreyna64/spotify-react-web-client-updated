import type { IncomingMessage, ServerResponse } from 'http';

let tracks = [
  {
    id: '2mXqcNCW1IAB88Y7Hz9zsz',
    name: '三天三夜',
    start: '0:00',
    duration: 50,
  },
  {
    id: '2gNjmvuQiEd2z9SqyYi8HH',
    name: 'Summertime',
    start: '0:10',
    duration: 50,
  },
];

function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tracks));
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const newTracks = JSON.parse(body);
        tracks = newTracks;
        console.log('Tracks updated successfully:', newTracks);

        const authHeader =
          req.headers['authorization'] || req.headers['Authorization'];

        if (authHeader) {
          try {
            const response = await fetch('https://api.spotify.com/v1/me', {
              headers: {
                Authorization: authHeader as string,
              },
            });

            if (response.ok) {
              const spotifyUserData = await response.json();
              console.log('Spotify user data:', spotifyUserData);
            } else {
              console.error(
                'Failed to fetch Spotify user data:',
                response.status,
                response.statusText
              );
              const errorBody = await response.text();
              console.error('Spotify API error response:', errorBody);
            }
          } catch (error) {
            console.error('Error fetching Spotify user data:', error);
          }
        } else {
          console.log('No Authorization header provided');
        }

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
