import { getFromLocalStorageWithExpiry } from '../utils/localstorage';

export const tracksService = {
  getTrackTimeout: async () => {
    const access_token = getFromLocalStorageWithExpiry('access_token') as string;
    const response = await fetch('/api/tracks/v2/track_timeout', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.json();
  },

  setTrackTimeout: async (
    tracks: { id: string; name: string; start: string; duration: number }[]
  ) => {
    const access_token = getFromLocalStorageWithExpiry('access_token') as string;
    const response = await fetch('/api/tracks/v2/track_timeout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(tracks),
    });
    return response.json();
  },

  deleteTrackTimeout: async (tracks: { id: string }[]) => {
    const access_token = getFromLocalStorageWithExpiry('access_token') as string;
    const response = await fetch('/api/tracks/v2/track_timeout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(tracks),
    });
    return response.json();
  },
};
