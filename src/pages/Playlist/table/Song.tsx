import { useCallback, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PlaylistItemWithSaved } from '../../../interfaces/playlists';
import SongView, { SongViewComponents } from '../../../components/SongsTable/songView';
import { msToTime, timeToMs } from '../../../utils';
import { Modal, InputNumber, TimePicker } from 'antd';
import { FaGear } from 'react-icons/fa6';

// Redux
import { playlistActions } from '../../../store/slices/playlist';
import { useAppDispatch, useAppSelector } from '../../../store/store';

dayjs.extend(customParseFormat);

interface SongProps {
  index: number;
  song: PlaylistItemWithSaved;
  extendedTracks: Map<string, { start: string; duration: number }>;
}

export const Song = (props: SongProps) => {
  const { song, index, extendedTracks } = props;

  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.playlist.view);
  const canEdit = useAppSelector((state) => state.playlist.canEdit);
  const playlist = useAppSelector((state) => state.playlist.playlist);

  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);

  const trackDurationMs = song.track.duration_ms;
  const maxMinutes = Math.floor(trackDurationMs / 60000);
  const maxSeconds = Math.floor((trackDurationMs % 60000) / 1000);
  const totalSeconds = Math.floor(trackDurationMs / 1000);

  const disabledTime = () => ({
    disabledMinutes: (_hour: number) =>
      Array.from({ length: 59 - maxMinutes }, (_, i) => maxMinutes + 1 + i),
    disabledSeconds: (_hour: number, minute: number) =>
      minute === maxMinutes
        ? Array.from(
            { length: 59 - maxSeconds },
            (_, i) => maxSeconds + 1 + i,
          )
        : [],
  });

  const remainingSeconds = Math.max(
    totalSeconds -
      (startTime ? startTime.minute() * 60 + startTime.second() : 0),
    0,
  );

  const toggleLike = useCallback(() => {
    dispatch(playlistActions.setTrackLikeState({ id: song.track.id, saved: !song.saved }));
  }, [dispatch, song.saved, song.track.id]);

  return (
    <SongView
      activable
      view={view}
      index={index}
      canEdit={canEdit}
      song={song.track}
      saved={song.saved}
      playlist={playlist}
      addedAt={song.added_at}
      onToggleLike={toggleLike}
      context={{
        context_uri: playlist?.uri,
        offset: { position: index },
      }}
      fields={[
        SongViewComponents.TitleWithCover,
        SongViewComponents.Artists,
        SongViewComponents.Album,
        SongViewComponents.AddedAt,
        (props) => <SongViewComponents.AddToLiked {...props} onLikeRefresh={toggleLike} />,
        (props) => {
          const info = extendedTracks.get(props.song.name);
          const duration = info
            ? `${info.start}-${msToTime(
                timeToMs(info.start) + info.duration * 1000,
              )}`
            : msToTime(props.song.duration_ms);
          return (
            <>
              <p
                className='text-right '
                style={{
                  flex: 2,
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                }}
              >
                {duration}
                <button
                  className='ml-2 text-xs'
                  onClick={() => setOpen(true)}
                  aria-label='settings'
                >
                  <FaGear />
                </button>
              </p>
              <Modal
                className="track-time-settings-modal"
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                title='設定播放時間'
              >
                <TimePicker
                  className='mb-2 w-full track-time-picker'
                  value={startTime}
                  onChange={(value) => setStartTime(value)}
                  format='mm:ss'
                  disabledTime={disabledTime}
                  showNow={false}
                />
                <InputNumber
                  placeholder='播放秒數'
                  className='w-full track-duration-input'
                  value={seconds ?? undefined}
                  onChange={(value) =>
                    setSeconds(typeof value === 'number' ? value : null)
                  }
                  max={remainingSeconds}
                />
              </Modal>
            </>
          );
        },
        SongViewComponents.Actions,
      ]}
    />
  );
};

export default Song;
