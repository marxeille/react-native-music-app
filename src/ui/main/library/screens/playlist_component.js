import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { wrap } from '../../../../themes';
import Loading from '../../../components/loading';
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
    rootStore.libraryStore.fetchData();
  }

  renderPlaylistHeader = () => {
    return (
      <>
        <PlaylistItem />
      </>
    );
  };

  renderPlaylist = item => {
    return (
      <>
        <PlaylistItem index={item.index} item={item.item} />
      </>
    );
  };

  render() {
    return (
      <View style={{ marginBottom: 195 }}>
        <View cls="pt3">
          <SearchComponent />
        </View>
        <View cls="pt3 fullHeight">
          {rootStore.libraryStore.state == 'loading' ? (
            <Loading />
          ) : (
            <FlatList
              ListHeaderComponent={this.renderPlaylistHeader()}
              showsVerticalScrollIndicator={false}
              data={rootStore.libraryStore.playlists}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderPlaylist}
            />
          )}
        </View>
      </View>
    );
  }
}
