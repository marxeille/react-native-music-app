import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import SongOfAlPlaylistStore from '../../../data/repository/song_of_playlist_store';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import BottomModal from '../../components/modal/BottomModal';
import PlaylistMenu from '../components/playlist_menu';
import Images from '../../../assets/icons/icons';
import { wrap } from '../../../themes';

@observer
export default class PlaylistDetail extends Component {
  constructor(props) {
    super(props);
    this.model = SongOfAlPlaylistStore.create({
      id: props.route.params.id,
      state: 'loading',
      songs: [],
    });
    this.modalMenu = React.createRef();
  }

  componentWillUnmount() {
    this.cancelablePromise.cancel();
  }

  _showModal = () => {
    if (this.modalMenu && this.modalMenu.current) {
      this.modalMenu.current._showModal();
    }
  };

  _hideModal = () => {
    if (this.modalMenu && this.modalMenu.current) {
      this.modalMenu.current._hideModal();
    }
  };

  renderRightACtion = wrap(() => {
    return (
      <View cls="jcc pv1 ph3 aic">
        <TouchableOpacity onPress={this._hideModal}>
          <Image source={Images.ic_v} />
        </TouchableOpacity>
      </View>
    );
  });

  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}>
        <Text>{rootStore.playlist.get(this.model.id).title()}</Text>
        <Text>{this.model.songs.length}</Text>
        <TouchableOpacity onPress={this._showModal}>
          <Text>modal</Text>
        </TouchableOpacity>
        <BottomModal
          ref={this.modalMenu}
          title={'Chỉnh sửa Playlist'}
          justifyCenterModal
          forceInsetBottom="never"
          containerCls=""
          rightComponent={this.renderRightACtion()}>
          <View cls="mb5">
            <PlaylistMenu />
          </View>
        </BottomModal>
      </View>
    );
  }
}
