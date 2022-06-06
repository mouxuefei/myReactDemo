import { AppRegistry } from 'react-native';
import { isTablet } from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import { AppRootHelper } from './AppRootHelper';
import { name as appName } from '../app.json';
import { AppContainer } from './AppContainer';
function selfSetJSExceptionHandler() {
  // const originHandler = global.ErrorUtils.getGlobalHandler();
  // const exceptionhandler = (error, isFatal) => {
  //   const parsedStack = parseErrorStack(error);
  //   const hotFixInfo = globalStore().getState().hotfixInfo;
  //   const hotFixLocagePage: LocalPackage =
  //     hotFixInfo.localPackgeResult.slice(-1);
  //   let hotFitVersion = '非热更新包';
  //   if (hotFixLocagePage?.resolve) {
  //     hotFitVersion = `${hotFixLocagePage.appVersion}(${hotFixLocagePage.label})`;
  //   }
  //   const hotFixMode = hotFixInfo.mode;
  // const { CrashlyticsRNHandler } = NativeModules;
  // TODO jsError上报格式修改为之前的
  // if (CrashlyticsRNHandler) {
  //   CrashlyticsRNHandler.recordException({
  //     message: error.message,
  //     parsedStack,
  //     isFatal,
  //     hotFixMode,
  //     hotFitVersion,
  //   });
  // }
  // const params = {
  //   message: error.message,
  //   parsedStack,
  //   isFatal,
  //   hotFixMode,
  //   hotFitVersion,
  // };
  // Bugly.recordException(params);
  // originHandler(error, isFatal);
  // };
  // setJSExceptionHandler(exceptionhandler, true);
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
