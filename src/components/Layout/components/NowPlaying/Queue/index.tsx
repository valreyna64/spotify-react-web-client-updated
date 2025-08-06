import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NowPlayingLayout } from '../layout';
import { useAppSelector } from '../../../../../store/store';

import QueueSongDetails from './SongDetails';

interface NowPlayingProps {
  extendedTracks: Set<string>;
}

const NowPlaying = ({ extendedTracks }: NowPlayingProps) => {
  const [t] = useTranslation(['playingBar']);
  const song = useAppSelector(
    (state) => state.spotify.state?.track_window.current_track,
    (a, b) => a?.id === b?.id
  );
  if (!song) return null;

  const durationText = extendedTracks.has(song.name) ? '0:00-0:50' : 'full song';

  return (
    <div>
      <p className='playing-section-title'>{t('Now playing')}</p>
      <div style={{ margin: 5 }}>
        <QueueSongDetails song={song} isPlaying={true} durationText={durationText} />
      </div>
    </div>
  );
};

interface QueueingProps {
  extendedTracks: Set<string>;
}

const Queueing = ({ extendedTracks }: QueueingProps) => {
  const [t] = useTranslation(['playingBar']);
  const queue = useAppSelector((state) => state.queue.queue);

  if (!queue || !queue.length) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <p className='playing-section-title'>{t('Next')}</p>

      <div style={{ margin: 5 }}>
        {queue.map((q, index) => {
          const durationText = extendedTracks.has(q.name) ? '0:00-0:50' : 'full song';
          return <QueueSongDetails key={index} song={q} durationText={durationText} />;
        })}
      </div>
    </div>
  );
};

export const Queue = () => {
  const [t] = useTranslation(['playingBar']);
  const [extendedTracks, setExtendedTracks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const url = process.env.REACT_APP_EXTENDED_TIMEOUT_TRACKS_URL;
    if (!url) return;
    fetch(url)
      .then((res) => res.json())
      .then((tracks: string[]) => {
        setExtendedTracks(new Set(tracks));
      })
      .catch((err) => {
        console.error('Failed to load extended timeout tracks', err);
      });
  }, []);

  return (
    <NowPlayingLayout title={t('Queue')}>
      <div style={{ marginTop: 20 }}>
        <NowPlaying extendedTracks={extendedTracks} />
        <Queueing extendedTracks={extendedTracks} />
      </div>
    </NowPlayingLayout>
  );
};
