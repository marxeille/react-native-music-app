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

  componentDidMount() {
    // if (
    //   rootStore.userStore.playlists == undefined ||
    //   rootStore.userStore.playlists.length == 0
    // ) {
    //   rootStore.userStore.fetchPlayListOfUser();
    // }
  }

  renderPlaylist = item => {
    console.log('TCL: playlistComponent -> renderPlaylist item', item.index);
    return null;
    // return (
    //   <>
    //     <AlbumItem index={item.index} />
    //   </>
    // );
  };

  render() {
    // let newArr = [...rootStore.userStore.playlists];

    return (
      <>
        <View cls="pt3">
          <SearchComponent />
        </View>
        <View cls="pt3 fullHeight" style={{ marginBottom: 95 }}>
          <FlatList
            data={[1, 2, 3]}
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
