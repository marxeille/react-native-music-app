import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';
import PlaylistItem from '../components/playlist_item_component';

@wrap
export default class playlistComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPlaylist = item => {
    return (
      <>
        <PlaylistItem title={'DSK'} img owner={'Lại Hoàng Anh Sơn'} />
      </>
    );
  };

  render() {
    return (
      <>
        <View cls="pt3">
          <SearchComponent />
        </View>
        <View cls="pt3">
          <FlatList
            ListHeaderComponent={<PlaylistItem />}
            data={[1, 2, 3, 4]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderPlaylist}
          />
        </View>
      </>
    );
  }
}
