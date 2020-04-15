import React, { useState, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import CreatePlaylistModal from './create_playlist';
import AddSongPlaylist from './add_song';
import { CreatePlaylistModel } from './model/view_model';

const CreatePlaylist = observer(props => {
  let viewModel = useRef(
    CreatePlaylistModel.create({ state: 'success', name: '' }),
  );
  const [addSong, setAddSong] = useState(false);
  const toggleAddSong = useCallback(state => {
    setAddSong(state);
  });
  return !addSong ? (
    <CreatePlaylistModal
      toggleAddSong={toggleAddSong}
      _hideModal={props._hideModal}
      viewModel={viewModel}
    />
  ) : (
    <AddSongPlaylist toggleAddSong={toggleAddSong} viewModel={viewModel} />
  );
});

export default CreatePlaylist;
