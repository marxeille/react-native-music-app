import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SongOfAlBumStore from '../../../data/repository/song_of_album_store';
import { observer } from 'mobx-react';
import { apiService } from '../../../data/context/api_context';
import { makeCancelable } from '../../../utils';

@observer
export default class AlbumDetail extends Component {

  constructor(props) {
    super(props);
    this.model = SongOfAlBumStore.create({
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
      <View>
        <Text>`${this.model.album.title()}`</Text>
      </View>
    );
  }
}
