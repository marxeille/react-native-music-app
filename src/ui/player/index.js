import * as React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { TabView } from 'react-native-tab-view';
import Player2 from './new_player/App';
import Queue from './queue_2';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import {
  getStatusBarHeight,
  D_WIDTH,
  D_HEIGHT,
  isSmallDevice,
  isMeidumDevice,
} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { rootStore } from '../../data/context/root_context';
import { observer } from 'mobx-react';

@observer
@wrap
export default class PlayerTabView extends React.Component {
  state = {
    index: 0,
    routes: [{ key: 'player' }, { key: 'queue' }],
  };

  _handleIndexChange = index => {
    this.setState({ index });
  };

  _renderTabBar = wrap(props => {
    return (
      <View style={styles.tabBar} cls="aic jcc">
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.tabItem,
                { paddingTop: getStatusBarHeight() + 10 },
              ]}
              onPress={() => this.setState({ index: i })}>
              <View cls="aic jcc">
                {i == this.state.index ? (
                  <Image
                    cls="ma1 widthFn-8 heightFn-8"
                    source={Images.ic_circle}
                  />
                ) : (
                  <Image
                    cls="widthFn-8 heightFn-8"
                    source={Images.ic_uncheck_circle}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'player':
        return (
          <Player2
            {...this.props}
            _handleIndexChange={this._handleIndexChange}
          />
        );
      case 'queue':
        return (
          <Queue {...this.props} _handleIndexChange={this._handleIndexChange} />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <LinearGradient
        colors={['#291047', '#1a0632', '#110926', '#110926']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderTopLeftRadius: !isSmallDevice() && !isMeidumDevice() ? 30 : 0,
          borderTopRightRadius: !isSmallDevice() && !isMeidumDevice() ? 30 : 0,
        }}>
        <View cls="fullView">
          {this.state.index == 0 ? (
            <>
              <Image
                blurRadius={30}
                style={styles.bg}
                source={
                  rootStore.playerStore?.currentSong?.artwork
                    ? { uri: rootStore.playerStore?.currentSong?.artwork }
                    : Images.bAAlbum
                }
              />
              <Image style={styles.bgWave} source={Images.default_wave_bg} />
            </>
          ) : null}
          <TabView
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
          />
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    width: D_WIDTH,
    height: D_HEIGHT / 2 - 50,
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  bgWave: {
    width: D_WIDTH,
    height: D_HEIGHT / 2,
    position: 'absolute',
    top: D_HEIGHT / 2 - 50,
    zIndex: -1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 0,
  },
  tabItem: {
    alignItems: 'center',
  },
});
