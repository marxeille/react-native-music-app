/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import { buildTheme } from './src/config-theme';
import TrackPlayer from 'react-native-track-player';
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
buildTheme();
AppRegistry.registerComponent(appName, () => App);
// await TrackPlayer.setupPlayer({
//   backgroundService: () => require('./src/ui/player/service/service'),
// });
TrackPlayer.registerPlaybackService(() =>
  require('./src/ui/player/service/service'),
);
