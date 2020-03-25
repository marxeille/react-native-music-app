import * as React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PlayerFullComponent from './player_full_component';
import Player2 from './new_player/App';
// import Queue from './queue_component';
import Queue from './queue_2';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import { getStatusBarHeight } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';

@wrap
export default class PlayerTabView extends React.Component {
  state = {
    index: 0,
    routes: [{ key: 'player' }, { key: 'queue' }],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderTabBar = wrap(props => {
    return (
      <View style={styles.tabBar} cls="aic jcc">
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[styles.tabItem, { paddingTop: getStatusBarHeight() }]}
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
        return <Player2 {...this.props} />;
      case 'queue':
        return <Queue {...this.props} />;
      default:
        return null;
    }
  };

  render() {
    return (
      <LinearGradient
        colors={['#291047', '#1a0632', '#110926', '#110926']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
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
  tabBar: {
    flexDirection: 'row',
    paddingTop: 0,
  },
  tabItem: {
    alignItems: 'center',
  },
});
