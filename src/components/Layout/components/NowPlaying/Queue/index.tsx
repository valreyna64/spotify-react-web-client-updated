import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NowPlayingLayout } from '../layout';
import { useAppSelector } from '../../../../../store/store';
import { msToTime, timeToMs } from '../../../../../utils';

import QueueSongDetails from './SongDetails';

interface NowPlayingProps {
  extendedTracks: Map<string, { start: string; duration: number }>;
}

const NowPlaying = ({ extendedTracks }: NowPlayingProps) => {
  const [t] = useTranslation(['playingBar']);
  const song = useAppSelector(
    (state) => state.spotify.state?.track_window.current_track,
    (a, b) => a?.id === b?.id
  );
  if (!song) return null;

  const info = extendedTracks.get(song.name);
  const durationText = info
    ? `${info.start}-${msToTime(timeToMs(info.start) + info.duration * 1000)}`
    : 'full song';

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
  extendedTracks: Map<string, { start: string; duration: number }>;
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
          const info = extendedTracks.get(q.name);
          const durationText = info
            ? `${info.start}-${msToTime(
                timeToMs(info.start) + info.duration * 1000,
              )}`
            : 'full song';
          return (
            <QueueSongDetails key={index} song={q} durationText={durationText} />
          );
        })}
      </div>
    </div>
  );
};

export const Queue = () => {
  const [t] = useTranslation(['playingBar']);
  const [extendedTracks, setExtendedTracks] = useState<
    Map<string, { start: string; duration: number }>
  >(new Map());

  useEffect(() => {
    fetch('/api/tracks/v2/track_timeout')
      .then((res) => res.json())
      .then(
        (
          tracks: { name: string; start: string; duration: number }[],
        ) => {
          const map = new Map<string, { start: string; duration: number }>();
          tracks.forEach((t) => {
            map.set(t.name, { start: t.start, duration: t.duration });
          });
          setExtendedTracks(map);
        },
      )
      .catch((err) => {
        console.error('Failed to load track timeout data', err);
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
