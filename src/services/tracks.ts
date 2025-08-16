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
};
