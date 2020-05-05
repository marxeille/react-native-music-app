import * as React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { wrap } from '../../../../themes';
import LinearGradientText from '../components/LinearGradientText';
import Playlist from './playlist_component';
import Artist from './artist_component';
import Album from './album_component';
import Images from '../../../../assets/icons/icons';
import Loading from '../../../components/loading';
import { rootStore } from '../../../../data/context/root_context';
import { observer } from 'mobx-react';
import BottomModal from '../../../components/modal/BottomModal';
import LinearGradient from 'react-native-linear-gradient';
import { isSmallDevice } from '../../../../utils';

@observer
@wrap
export default class LibraryTabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      indexFilter: -1,
      routes: [
        { key: 'playlist', title: 'Playlist' },
        { key: 'artist', title: 'Nghệ sĩ' },
        { key: 'album', title: 'Album' },
      ],
    };
    this.filterItems = [
      {
        title: 'Lọc theo:',
      },
      {
        title: 'Tải xuống',
      },
      {
        title: 'Sắp xếp theo:',
      },
      {
        title: 'Mới thêm vào',
      },
      {
        title: 'Chơi nhiều nhất',
      },
      {
        title: 'Tên playlist',
      },
    ];
    this.modalFilter = React.createRef();
  }

  _handleIndexChange = index => this.setState({ index });

  _renderTabBar = wrap(props => {
    return (
      <View cls="pr2" style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={i.toString()}
              style={styles.tabItem}
              onPress={() => {
                this.setState({ index: i });
                Keyboard.dismiss();
              }}
              accessible={false}>
              <View cls="fullWidth">
                {i == this.state.index ? (
                  <View
                    cls={[
                      i == 0
                        ? 'jcfs aifs asfs'
                        : i == 1
                        ? 'aic'
                        : i == 2
                        ? 'jcfe asfe aife'
                        : '',
                    ]}>
                    <View cls="jcc asc aic">
                      <Image
                        cls="widthFn-30 heightFn-35"
                        source={Images.ic_logo}
                      />

                      <LinearGradientText
                        text={route.title}
                        end={{ x: 0.8, y: 0 }}
                        styles={{
                          fontSize: 20,
                          fontFamily: 'Averta-ExtraBold',
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View
                    cls={[
                      i == 0
                        ? ''
                        : i == 1
                        ? 'aic jcc'
                        : i == 2
                        ? 'aife jcfe'
                        : '',
                    ]}>
                    <View cls="widthFn-30 heightFn-35" />
                    <Text cls="white fw7 avertaFont" style={{ fontSize: 20 }}>
                      {route.title}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });

  _showModal = () => {
    if (this.modalFilter && this.modalFilter.current) {
      this.modalFilter.current._showModal();
    }
  };

  _hideModal = () => {
    if (this.modalFilter && this.modalFilter.current) {
      this.modalFilter.current._hideModal();
    }
  };

  onClickItemFilter = item => {
    this.setState({ indexFilter: item.index });
  };

  renderFilterItem = wrap(item => {
    return (
      <>
        {item.index == 0 || item.index == 2 ? (
          <View>
            <Text
              cls={`${isSmallDevice() ? 'f12' : 'f10'} pb2 pt2 pl3 pr3`}
              style={{ color: '#9166cc', fontFamily: 'lato-heavy' }}>
              {item.item.title}
            </Text>
            {item.index == 0 ? (
              <TouchableOpacity
                cls="absolute mt2 pr2 asfe"
                onPress={() => this._hideModal()}>
                <Image cls="widthFn-15 heightFn-15" source={Images.ic_delete} />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => this.onClickItemFilter(item)}>
            <Text
              cls={`${
                item.index == this.state.indexFilter ? 'bg-#2c184a' : ''
              } ${isSmallDevice() ? 'f8' : 'f6'} white pt2 pb2 pl3 pr3`}
              style={{ fontFamily: 'lato-heavy' }}>
              {item.item.title}
            </Text>
          </TouchableWithoutFeedback>
        )}
      </>
    );
  });

  _renderModalContent = wrap(() => {
    return (
      <View cls="aic">
        <LinearGradient
          colors={['#291047', '#1a0632', '#110926', '#110926']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <ImageBackground
            cls={`${isSmallDevice() ? 'widthFn-180' : 'widthFn-250'}`}
            source={Images.bg2}>
            <FlatList
              data={this.filterItems}
              renderItem={this.renderFilterItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </ImageBackground>
        </LinearGradient>
      </View>
    );
  });

  _renderScene = SceneMap({
    playlist: () => (
      <Playlist _showModal={this._showModal} _hideModal={this._hideModal} />
    ),
    artist: () => (
      <Artist _showModal={this._showModal} _hideModal={this._hideModal} />
    ),
    album: () => (
      <Album _showModal={this._showModal} _hideModal={this._hideModal} />
    ),
  });

  render() {
    // if (rootStore.libraryStore.state == 'loading') {
    //   return (
    //     <View cls=" fullView aic jcc">
    //       <Loading />
    //     </View>
    //   );
    // }
    return (
      <View cls="flx-i">
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
        />
        <BottomModal
          ref={this.modalFilter}
          justifyCenterModal
          forceInsetBottom={'never'}
          headerNone={true}
          customGradient={['#1a0632', '#1a0632', '#000', '#13151A']}
          closeBottomNone={false}
          customView={true}
          style={{ with: 20 }}
          containerCls="">
          {this._renderModalContent()}
        </BottomModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
});
