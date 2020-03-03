import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SongOfAlBumStore from '../../../data/repository/song_of_album_store';
import { observer } from 'mobx-react';

@observer
export default class AlbumDetail extends Component {

  constructor(props) {
    super(props);
    this.model = SongOfAlBumStore.create({
      album: "1",
      state: 'loading'
    })
  }

  componentDidMount() {
    this.model.fetchData()
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <View>
        <Text>`${this.model.album.title()}`</Text>
      </View>
    );
  }
}
