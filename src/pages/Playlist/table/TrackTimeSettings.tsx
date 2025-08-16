import { useState, useEffect } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  ConfigProvider,
  Modal,
  InputNumber,
  TimePicker,
  theme,
  Switch,
} from 'antd';
import { FaGear } from 'react-icons/fa6';
import { msToTime, timeToMs } from '../../../utils';
import { type Track } from '../../../interfaces/track';

dayjs.extend(customParseFormat);

interface TrackTimeSettingsProps {
  song: Track;
  extendedTracks: Map<string, { start: string; duration: number }>;
  onSave: (
    songId: string,
    songName: string,
    settings: { start: string; duration: number } | null
  ) => void;
}

export const TrackTimeSettings = (props: TrackTimeSettingsProps) => {
  const { song, extendedTracks, onSave } = props;

  const [open, setOpen] = useState(false);
  const [isCustomTimeEnabled, setIsCustomTimeEnabled] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      const info = extendedTracks.get(song.id);
      if (info) {
        setIsCustomTimeEnabled(true);
        setStartTime(dayjs(info.start, 'mm:ss'));
        setSeconds(info.duration);
      } else {
        setIsCustomTimeEnabled(false);
        setStartTime(null);
        setSeconds(null);
      }
    }
  }, [open, song.id, extendedTracks]);

  const trackDurationMs = song.duration_ms;
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
            (_, i) => maxSeconds + 1 + i
          )
        : [],
  });

  const remainingSeconds = Math.max(
    totalSeconds -
      (startTime ? startTime.minute() * 60 + startTime.second() : 0),
    0
  );

  const info = extendedTracks.get(song.id);
  const duration = info
    ? `${info.start}-${msToTime(
        timeToMs(info.start) + info.duration * 1000
      )}`
    : msToTime(song.duration_ms);

  const handleOk = () => {
    if (isCustomTimeEnabled) {
      if (startTime && seconds !== null) {
        onSave(
          song.id,
          song.name, {
          start: startTime.format('mm:ss'),
          duration: seconds,
        });
      }
    } else {
      onSave(song.id, song.name, null);
    }
    setOpen(false);
  };

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
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Modal
          destroyOnClose
          className="track-time-settings-modal"
          open={open}
          onOk={handleOk}
          onCancel={() => setOpen(false)}
          title={`設定 ${song.name} 播放時長`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Switch
              checked={isCustomTimeEnabled}
              onChange={setIsCustomTimeEnabled}
            />
            <span>自訂播放時間</span>
          </div>
          {isCustomTimeEnabled && (
            <div className='mt-4'>
              <TimePicker
                className='mb-2 w-full track-time-picker'
                value={startTime}
                onChange={(value) => setStartTime(value)}
                format='mm:ss'
                disabledTime={disabledTime}
                showNow={false}
                inputReadOnly
              />
              <InputNumber
                placeholder='播放秒數'
                className='duration-input'
                value={seconds ?? undefined}
                onChange={(value) =>
                  setSeconds(typeof value === 'number' ? value : null)
                }
                max={remainingSeconds}
                step="0.1"
                min={0}
                inputMode="decimal"
              />
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default TrackTimeSettings;
