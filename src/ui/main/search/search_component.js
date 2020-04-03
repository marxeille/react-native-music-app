import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../library/components/LinearGradientText';
import { getStatusBarHeight } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from './components/search_bar';
import SearchItem from './components/search_item';
import { SearchModel } from './view_model';
import Loading from '../../components/loading';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import BottomModal from '../../../ui/components/modal/BottomModal';
import SongMenu from '../../../ui/player/components/song_menu';
@observer
@wrap
export default class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHistory: true,
      keyword: null,
      song: null,
    };
    this.viewmodel = SearchModel.create({ state: 'loading' });
    this.modalMenu = React.createRef();
    this.timeout = 0;
  }

  componentDidMount() {
    this.viewmodel.getRecentlyResult();
  }

  _showModal = song => {
    this.setState({ song: song }, () => {
      if (this.modalMenu && this.modalMenu.current) {
        this.modalMenu.current._showModal();
      }
    });
  };

  _hideModal = () => {
    if (this.modalMenu && this.modalMenu.current) {
      this.modalMenu.current._hideModal();
    }
  };

  onChangeKeyword = keyword => {
    this.setState({ keyword: keyword });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      //search function
      if (keyword !== '') this.viewmodel.searchByKeyword(keyword);
    }, 1300);
  };

  onFocus = () => {
    this.setState({ showHistory: true });
  };

  renderSearchSection = () => {
    return (
      <>
        <LinearGradient
          colors={['#120228', '#1c0836', '#291048']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View style={{ paddingTop: getStatusBarHeight() }}>
            <View cls="pa3">
              <LinearGradientText
                text={'Tìm kiếm'}
                end={{ x: 0.2, y: 0 }}
                styles={{
                  justifyContent: 'center',
                  fontSize: 23,
                  fontFamily: 'Averta-ExtraBold',
                  fontWeight: '800',
                }}
              />
              <SearchBar
                keyword={this.state.keyword}
                onChangeKeyword={this.onChangeKeyword}
                onFocus={this.onFocus}
              />
              <Text cls="white fw6 f10 lightFont">
                {this.state.keyword == '' || this.state.keyword == null
                  ? 'Tìm gần đây'
                  : 'Duyệt tìm tất cả'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </>
    );
  };

  renderResultSection = wrap((title, data) => {
    return (
      <View cls="pt4">
        <View cls="flx-row aife">
          <Text cls="white fw8 f5 avertaFont">{title}</Text>
          <View cls="bg-#4b3277 heightFn-1 fullWidth flx-i mb1"></View>
        </View>
        <View>
          {data.map((item, index) => (
            <TouchableOpacity key={index.toString()}>
              <Text cls="primaryPurple pt3 fw6 f6 lightFont">
                {item?.title ?? `hey hey ${index}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  });

  renderSearchItem = wrap(item => {
    return (
      <>
        <SearchItem
          item={item.item}
          _showModal={this._showModal}
          model={this.viewmodel}
        />
      </>
    );
  });

  renderEmptyContainer = wrap(() => (
    <View cls="aic jcc pt3">
      <Text cls="lightFont white">Không có dữ liệu</Text>
    </View>
  ));

  clearRecently = () => {
    rootStore.playerStore.clearSong();
    this.viewmodel.removeAllRecently();
  };

  render() {
    const { showHistory, keyword, song } = this.state;
    const data =
      keyword == '' || keyword == null || keyword == undefined
        ? [
            ...this.viewmodel.recentlySong.values(),
            ...this.viewmodel.recentlyAlbum.values(),
            ...this.viewmodel.recentlyArtist.values(),
          ]
        : [
            ...this.viewmodel.resultSongs.values(),
            ...this.viewmodel.resultAlbums.values(),
            ...this.viewmodel.resultArtists.values(),
          ];

    return (
      <LinearGradient
        colors={['#291048', '#1a0732', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView" source={Images.bg2}>
            {this.renderSearchSection()}
            {this.viewmodel.state == 'loading' ? (
              <View cls="aic jcc pt5">
                <Loading />
              </View>
            ) : keyword || showHistory ? (
              <View cls="pa3 pt0 fullView">
                <FlatList
                  data={data}
                  showsVerticalScrollIndicator={false}
                  renderItem={this.renderSearchItem}
                  ListEmptyComponent={this.renderEmptyContainer()}
                  keyExtractor={(item, index) => index.toString()}
                />
                {keyword == '' || keyword == null || keyword == undefined ? (
                  <View
                    style={{ position: 'absolute', right: 12, bottom: 225 }}>
                    <TouchableOpacity onPress={() => this.clearRecently()}>
                      <View
                        cls="ba pa2 pt1 pb1 br5"
                        style={{ borderColor: '#d8a1c8' }}>
                        <Text cls="white lightFont f10 fw8">Xoá tất cả</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : (
              <ScrollView contentContainerCls="pa3 pt1">
                <View>{this.renderResultSection('Nghệ sĩ', [1, 2, 3])}</View>
                <View>
                  {this.renderResultSection('Bài hát', [
                    ...rootStore?.homeStore?.popularSongs,
                  ])}
                </View>
              </ScrollView>
            )}
            <BottomModal ref={this.modalMenu} headerNone>
              <SongMenu song={song} />
            </BottomModal>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}
