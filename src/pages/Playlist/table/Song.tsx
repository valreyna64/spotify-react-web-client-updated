import { useCallback } from 'react';
import { PlaylistItemWithSaved } from '../../../interfaces/playlists';
import SongView, { SongViewComponents } from '../../../components/SongsTable/songView';
import TrackTimeSettings from './TrackTimeSettings';

// Redux
import { playlistActions } from '../../../store/slices/playlist';
import { useAppDispatch, useAppSelector } from '../../../store/store';

interface SongProps {
  index: number;
  song: PlaylistItemWithSaved;
  extendedTracks: Map<string, { start: string; duration: number }>;
  onSave: (
    songId: string,
    songName: string,
    settings: { start: string; duration: number } | null
  ) => void;
}

export const Song = (props: SongProps) => {
  const { song, index, extendedTracks, onSave } = props;

  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.playlist.view);
  const canEdit = useAppSelector((state) => state.playlist.canEdit);
  const playlist = useAppSelector((state) => state.playlist.playlist);

  const toggleLike = useCallback(() => {
    dispatch(
      playlistActions.setTrackLikeState({ id: song.track.id, saved: !song.saved }),
    );
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
        (props) => (
          <SongViewComponents.AddToLiked {...props} onLikeRefresh={toggleLike} />
        ),
        (props) => (
          <TrackTimeSettings
            song={props.song}
            extendedTracks={extendedTracks}
            onSave={onSave}
          />
        ),
        SongViewComponents.Actions,
      ]}
    />
  );
};

export default Song;
