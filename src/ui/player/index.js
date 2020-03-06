import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PlayerFullComponent from './player_full_component';
import Queue from './queue_component';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';

@wrap
export default class PlayerTabView extends React.Component {
  state = {
    index: 0,
    routes: [{ key: 'player' }, { key: 'queue' }],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderTabBar = wrap(props => {
    return null;
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => this.setState({ index: i })}>
              <View cls="pr5">
                {i == this.state.index ? (
                  <Image source={Images.ic_circle} />
                ) : (
                  <Image source={Images.ic_favorite} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });

  _renderScene = SceneMap({
    player: PlayerFullComponent,
    queue: Queue,
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
