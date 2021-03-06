/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import { buildTheme } from './src/config-theme';
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
buildTheme();

AppRegistry.registerComponent(appName, () => App);
