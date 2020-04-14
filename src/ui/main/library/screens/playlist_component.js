import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, Image } from 'react-native';
import { wrap } from '../../../../themes';
import Loading from '../../../components/loading';
import SearchComponent from '../components/search_component';
import PlaylistItem from '../components/playlist_item_component';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import { navigate } from '../../../../navigation/navigation_service';
import BottomModal from '../../../components/modal/BottomModal';
import Images from '../../../../assets/icons/icons';
import CreatePlayListModal from '../../../components/add_playlist_modal';

@observer
@wrap
export default class PlaylistComponent extends Component {
  constructor(props) {
    super(props);
    this.modalPlaylist = React.createRef();
    this.state = {};
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

  renderRightAction = () => {
    return (
      <View cls="jcc pv1 ph3 aic">
        <TouchableOpacity onPress={this._hideModal}>
          <Image source={Images.ic_v} />
        </TouchableOpacity>
      </View>
    );
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
          item ? navigate('album_detail', { id: item.id, item: item }) : null;
        }}>
        <PlaylistItem index={pl.index} item={item} />
      </TouchableOpacity>
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
              data={[...rootStore.libraryStore.playlists]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderPlaylist}
            />
          )}
        </View>
        <BottomModal
          ref={this.modalPlaylist}
          title={'Tạo Playlist'}
          justifyCenterModal
          rightComponent={this.renderRightAction()}
          containerCls="">
          <CreatePlayListModal />
        </BottomModal>
      </View>
    );
  }
}
