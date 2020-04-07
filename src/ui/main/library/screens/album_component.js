import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';
import AlbumItem from '../components/album_item_component';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';

@observer
@wrap
export default class AlbumComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPlaylist = item => {
    return (
      <>
        <AlbumItem item={item.item} />
      </>
    );
  };

  render() {
    const albums = [...rootStore.libraryStore.albums];

    return (
      <>
        <View cls="pt3">
          <SearchComponent />
        </View>
        <View cls="pt3" style={{ marginBottom: 95 }}>
          <FlatList
            data={albums}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderPlaylist}
            numColumns={3}
            horizontal={false}
          />
        </View>
      </>
    );
  }
}
