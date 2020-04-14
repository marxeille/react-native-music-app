import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import CreatePlaylistModal from './create_playlist';
import AddSongPlaylist from './add_song';

const CreatePlaylist = observer(props => {
  const [addSong, setAddSong] = useState(false);
  const toggleAddSong = useCallback(state => {
    setAddSong(state);
  });
  return !addSong ? (
    <CreatePlaylistModal
      toggleAddSong={toggleAddSong}
      renderRightAction={props.renderRightAction}
      _hideModal={props._hideModal}
    />
  ) : (
    <AddSongPlaylist toggleAddSong={toggleAddSong} />
  );
});

export default CreatePlaylist;
