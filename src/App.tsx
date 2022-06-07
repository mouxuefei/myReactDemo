import { AppRegistry } from 'react-native';
import { isTablet } from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import { name as appName } from '../app.json';
import { AppContainer } from './AppContainer';

function selfSetJSExceptionHandler() {
  // 异常上报
  // Bugly.recordException(params);
}

function lockOrientation() {
  if (isTablet()) {
    Orientation.unlockAllOrientations();
    return;
  }
  Orientation.lockToPortrait();
}

/**
 * 启动前的准备工作
 */
function prepare() {
  selfSetJSExceptionHandler();
}

function launch() {
  AppRegistry.registerComponent(appName, () => AppContainer);
}

function setupNavigation() {
  lockOrientation();
  launch();
}

function start() {
  prepare();
  setupNavigation();
}
export { start };
