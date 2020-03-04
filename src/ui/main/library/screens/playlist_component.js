import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';
import PlaylistItem from '../components/playlist_item_component';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';

@observer
@wrap
export default class playlistComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (rootStore.userStore.playlists == undefined || rootStore.userStore.playlists.length == 0) {
      rootStore.userStore.fetchPlayListOfUser();
    }
  }

  renderPlaylist = item => {
    console.log("TCL: playlistComponent -> renderPlaylist item", item)
    return (
      <>
        <PlaylistItem index={item.index} />
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
            data={rootStore.userStore.playlists}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderPlaylist}
          />
        </View>
      </>
    );
  }
}
