function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native'; // eslint-disable-next-line import/no-unresolved

import { ScreenContainer } from 'react-native-screens';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import ResourceSavingScene from './ResourceSavingScene';
import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import PlayerComponent from '../ui/player/player_component';

function SceneContent(_ref) {
  let { isFocused, children } = _ref;
  const { colors } = useTheme();
  return React.createElement(
    View,
    {
      accessibilityElementsHidden: !isFocused,
      importantForAccessibility: isFocused ? 'auto' : 'no-hide-descendants',
      style: [
        styles.content,
        {
          backgroundColor: colors.background,
        },
      ],
    },
    children,
  );
}

export default class BottomTabViewMusic extends React.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, 'state', {
      loaded: [this.props.state.index],
    });

    _defineProperty(this, 'renderTabBar', () => {
      const {
        tabBar = props => React.createElement(BottomTabBar, props),
        tabBarOptions,
        state,
        navigation,
      } = this.props;
      const { descriptors } = this.props;
      const route = state.routes[state.index];
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarVisible === false) {
        return null;
      }
      return tabBar(
        _objectSpread({}, tabBarOptions, {
          state: state,
          descriptors: descriptors,
          navigation: navigation,
        }),
      );
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { index } = nextProps.state;
    return {
      // Set the current tab to be loaded if it was not loaded before
      loaded: prevState.loaded.includes(index)
        ? prevState.loaded
        : [...prevState.loaded, index],
    };
  }

  render() {
    const { state, descriptors, lazy } = this.props;
    const { routes } = state;
    const { loaded } = this.state;
    return React.createElement(
      SafeAreaProviderCompat,
      {},
      React.createElement(
        View,
        {
          style: styles.container2,
        },
        React.createElement(
          View,
          {
            style: styles.container,
          },
          React.createElement(
            ScreenContainer,
            {
              style: styles.pages,
            },
            routes.map((route, index) => {
              const descriptor = descriptors[route.key];
              const { unmountOnBlur } = descriptor.options;
              const isFocused = state.index === index;

              if (unmountOnBlur && !isFocused) {
                return null;
              }

              if (lazy && !loaded.includes(index) && !isFocused) {
                // Don't render a screen if we've never navigated to it
                return null;
              }

              return React.createElement(
                ResourceSavingScene,
                {
                  key: route.key,
                  style: StyleSheet.absoluteFill,
                  isVisible: isFocused,
                },
                React.createElement(
                  SceneContent,
                  {
                    isFocused: isFocused,
                  },
                  descriptor.render(),
                ),
              );
            }),
          ),
          React.createElement(PlayerComponent, {
            style: styles.player,
          }),
        ),
        this.renderTabBar(),
      ),
    );
  }
}

_defineProperty(BottomTabViewMusic, 'defaultProps', {
  lazy: true,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  container2: {
    flex: 1,
    overflow: 'hidden',
  },
  pages: {
    flex: 1,
  },
  player: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    height: 56,
    width: '100%',
  },
  content: {
    flex: 1,
  },
});
//# sourceMappingURL=BottomTabView.js.map
