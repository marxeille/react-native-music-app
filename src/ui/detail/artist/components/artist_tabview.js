import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { wrap } from '../../../../themes';
import Images from '../../../../assets/icons/icons';
import { TabView } from 'react-native-tab-view';
import LinearGradient from 'react-native-linear-gradient';

@wrap
export default class ArtistTabView extends Component {
  state = {
    readMore: true,
    showCover: false,
    index: 0,
    routes: [{ key: 'cover' }, { key: 'detail' }],
  };

  _handleIndexChange = index => {
    if (index == 0) {
      this.setState({ showCover: false, readMore: true });
      this.props.showArtistDetailCover(true);
    } else {
      this.setState({ showCover: true, readMore: true });
      this.props.showArtistDetailCover(false);
    }
    this.setState({ index });
  };

  _renderTabBar = wrap(props => {
    return (
      <View style={styles.tabBar} cls="aic jcc">
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[styles.tabItem]}
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

  _renderScene = wrap(({ route }) => {
    const { artist } = this.props;
    const { showCover, readMore } = this.state;
    switch (route.key) {
      case 'cover':
        return (
          <View cls="pt2 asc" style={{ paddingBottom: showCover ? 0 : 150 }}>
            {showCover ? (
              <Image
                cls="squareFn-180"
                source={
                  typeof artist?.getThumb == 'function' &&
                  artist?.getThumb() !== ''
                    ? { uri: artist.getThumb() }
                    : Images.bAAlbum
                }
              />
            ) : null}
          </View>
        );
      case 'detail':
        return (
          <View cls="asc pa3 pt2 pb4">
            <Text cls="white latoFont">
              {readMore
                ? artist.getBio()
                : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean feugiat neque nec ipsum venenatis lacinia. Maecenas euismod volutpat risus non fermentum. Fusce dui felis, posuere eget volutpat vel, interdum non nibh. Cras vitae rutrum libero. Curabitur venenatis interdum nisl nec gravida. Etiam dui nunc, faucibus eu pellentesque a, sagittis quis quam. Fusce sed euismod odio. Ut in rutrum diam. Mauris viverra vulputate elit.`}
            </Text>
            <TouchableOpacity
              cls="asc pt2"
              onPress={() => this.setState({ readMore: !readMore })}>
              <LinearGradient
                colors={['#4a3278', '#9069A0', '#D39DC5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 15, height: 27, padding: 1 }}>
                <View
                  cls="heightFn-25 bg-#2C184A aic jcc"
                  style={{ borderRadius: 15 }}>
                  <Text cls="white pl3 pr3 latoFont">
                    {readMore ? 'Đọc thêm' : 'Thu gọn'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  });

  render() {
    return (
      <View>
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
        />
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
    alignItems: 'center',
  },
});
