import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';
import PlaylistItem from '../components/playlist_item_component';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';

@observer
@wrap
export default class PlaylistComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (
      rootStore.userStore.playlists == undefined ||
      rootStore.userStore.playlists.length == 0
    ) {
      rootStore.userStore.fetchPlayListOfUser();
    }
  }

  renderPlaylist = item => {
    console.log('TCL: playlistComponent -> renderPlaylist item', item.index);
    return (
      <>
        <PlaylistItem index={item.index} />
      </>
    );
  };

  render() {
    console.log('rootStore.userStore.playlists', rootStore.userStore.playlists);

    return (
      <View style={{ marginBottom: 195 }}>
        <View cls="pt3">
          <SearchComponent />
        </View>
        <View cls="pt3 fullHeight">
          <FlatList
            ListHeaderComponent={<PlaylistItem />}
            showsVerticalScrollIndicator={false}
            data={rootStore.userStore.playlists}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderPlaylist}
          />
        </View>
      </View>
    );
  }
}
