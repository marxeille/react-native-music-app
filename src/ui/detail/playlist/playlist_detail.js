import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SongOfAlPlaylistStore from '../../../data/repository/song_of_playlist_store';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import { resolveIdentifier } from 'mobx-state-tree';
import { PlayList } from '../../../data/model/playlist';
import { apiService } from '../../../data/context/api_context';
import { Song } from '../../../data/model/song';
import { makeCancelable } from '../../../utils/index'

@observer
export default class PlaylistDetail extends Component {

  constructor(props) {
    super(props);
    this.model = SongOfAlPlaylistStore.create({
      id: props.route.params.id,
      state: 'loading',
      songs: []
    })
  }

  componentDidMount() {
    this.cancelablePromise = makeCancelable(
      apiService.commonApiService.getSongsOfAlBum(1).then((values: Array) => {
        rootStore.updateSongs(values);
        this.model.addList(values.map(data => data.id));
      }));
  }

  componentWillUnmount() {
    this.cancelablePromise.cancel();
  }

  render() {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>
        <Text>{rootStore.playlist.get(this.model.id).title()}</Text>
        <Text>{this.model.songs.length}</Text>

      </View>
    );
  }
}
