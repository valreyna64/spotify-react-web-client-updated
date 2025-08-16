import type { IncomingMessage, ServerResponse } from 'http';


function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    (async () => {
      try {
        const scanResponse = await fetch(
          `${process.env.KV_REST_API_URL}/scan/0?match=track:*`,
          {
            headers: {
              Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
            },
          }
        );

        if (!scanResponse.ok) {
          const errorText = await scanResponse.text();
          console.error('Failed to scan for tracks:', errorText);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to scan for tracks' }));
          return;
        }

        const {
          result: [, keys],
        } = await scanResponse.json();

        console.log('Keys from SCAN:', keys);

        if (!keys || keys.length === 0) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([]));
          return;
        }

        const tracks = [];
        for (const key of keys) {
          const getResponse = await fetch(
            `${process.env.KV_REST_API_URL}/get/${key}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
              },
            }
          );

          if (getResponse.ok) {
            const trackData = await getResponse.json();
            console.log(`Data for key ${key}:`, trackData);
            if (trackData.result) {
              tracks.push(JSON.parse(trackData.result));
            }
          } else {
            console.error(`Failed to fetch key ${key}`);
          }
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(tracks));
      } catch (error) {
        console.error('Error fetching tracks from KV:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Failed to fetch tracks' }));
      }
    })();
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const newTracks = JSON.parse(body) as any[];

        for (const track of newTracks) {
          if (track.id) {
            try {
              const key = `track:${track.id}`;
              await fetch(`${process.env.KV_REST_API_URL}`, {
                headers: {
                  Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
                },
                body: JSON.stringify(['SET', key, JSON.stringify(track)]),
                method: 'POST',
              });
            } catch (e) {
              console.error('Failed to save track', e);
            }
          }
        }

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
