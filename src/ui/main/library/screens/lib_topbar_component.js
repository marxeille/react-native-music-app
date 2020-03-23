import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { wrap } from '../../../../themes';
import LinearGradientText from '../components/LinearGradientText';
import Playlist from './playlist_component';
import Artist from './artist_component';
import Album from './album_component';

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
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={i.toString()}
              style={styles.tabItem}
              onPress={() => this.setState({ index: i })}>
              <View cls="pr4">
                {i == this.state.index ? (
                  <LinearGradientText
                    text={route.title}
                    end={{ x: 0.8, y: 0 }}
                    borderBottom
                    styles={{
                      fontSize: 20,
                      fontFamily: 'Averta-ExtraBold',
                    }}
                  />
                ) : (
                  <Text cls="white fw7 pr2 avertaFont" style={{ fontSize: 20 }}>
                    {route.title}
                  </Text>
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
    alignItems: 'center',
  },
});
