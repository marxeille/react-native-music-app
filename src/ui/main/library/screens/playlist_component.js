import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { wrap } from '../../../../themes';
import Loading from '../../../components/loading';
import SearchComponent from '../components/search_component';
import PlaylistItem from '../components/playlist_item_component';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import { navigate } from '../../../../navigation/navigation_service';
import BottomModal from '../../../components/modal/BottomModal';
import CreatePlayListModal from '../../../components/add_playlist_modal';

@observer
@wrap
export default class PlaylistComponent extends Component {
  constructor(props) {
    super(props);
    this.modalPlaylist = React.createRef();
    this.state = {
      playlists: [{}, ...rootStore.libraryStore.playlists],
    };
  }

  componentDidMount() {
    rootStore.libraryStore.fetchData();
  }

  _showModal = () => {
    if (this.modalPlaylist && this.modalPlaylist.current) {
      this.modalPlaylist.current._showModal();
    }
  };

  _hideModal = () => {
    if (this.modalPlaylist && this.modalPlaylist.current) {
      this.modalPlaylist.current._hideModal();
    }
  };

  renderPlaylistHeader = () => {
    return (
      <TouchableOpacity onPress={() => this._showModal()}>
        <PlaylistItem />
      </TouchableOpacity>
    );
  };

  renderPlaylist = pl => {
    const { item } = pl;
    return (
      <TouchableOpacity
        onPress={() => {
          pl.index == 0
            ? this._showModal()
            : item
            ? navigate('album_detail', { id: item.id, item: item })
            : null;
        }}>
        {pl.index == 0 ? (
          <PlaylistItem />
        ) : (
          <PlaylistItem index={pl.index} item={item} />
        )}
      </TouchableOpacity>
    );
  };

  handleLoadMore = () => {
    // this.setState({
    //   playlists: [
    //     ...rootStore.libraryStore.playlists,
    //     ...rootStore.libraryStore.playlists,
    //   ],
    // });
  };

  render() {
    const { _showModal, _hideModal } = this.props;
    return (
      <View style={{ marginBottom: 200 }}>
        <View cls="pt3 pb2">
          <SearchComponent _showModal={_showModal} _hideModal={_hideModal} />
        </View>
        <View cls="pt3 fullHeight">
          {rootStore.libraryStore.state == 'loading' ? (
            <Loading />
          ) : (
            <FlatList
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              data={[{}, ...rootStore.libraryStore.playlists]}
              onScrollBeginDrag={Keyboard.dismiss}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              horizontal={false}
              renderItem={this.renderPlaylist}
              onEndReachedThreshold={0.5}
              onEndReached={() => this.handleLoadMore()}
            />
          )}
        </View>
        <BottomModal
          ref={this.modalPlaylist}
          headerNone={true}
          forceInsetTop={'never'}
          forceInsetBottom={'never'}
          justifyCenterModal
          containerCls="">
          <CreatePlayListModal _hideModal={this._hideModal} />
        </BottomModal>
      </View>
    );
  }
}
