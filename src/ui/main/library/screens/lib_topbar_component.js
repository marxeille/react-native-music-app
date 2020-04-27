import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
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

@observer
@wrap
export default class LibraryTabView extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'playlist', title: 'Playlist' },
      { key: 'artist', title: 'Nghệ sĩ' },
      { key: 'album', title: 'Album' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderTabBar = wrap(props => {
    return (
      <View cls="pr2" style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={i.toString()}
              style={styles.tabItem}
              onPress={() => this.setState({ index: i })}>
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

  _renderScene = SceneMap({
    playlist: Playlist,
    artist: Artist,
    album: Album,
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
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
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
