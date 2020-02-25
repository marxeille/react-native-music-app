/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
import {buildTheme} from './src/config-theme';

buildTheme();
AppRegistry.registerComponent(appName, () => App);
