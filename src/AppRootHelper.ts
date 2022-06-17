import { ScreenConstants } from './screens/ScreenConstants';
import {
  initAfterEnteringHome,
  initAfterEnteringHomeWithDelay,
  initBeforeEnteringHome,
  initThirdSDKBeforeEnteringHome,
} from './initTasks';
import { navigationRef } from './navigation/RootNavigation';

export class AppRootHelper {
  private static instance?: AppRootHelper;

  static shared(): AppRootHelper {
    if (AppRootHelper.instance == null) {
      AppRootHelper.instance = new AppRootHelper();
    }
    return AppRootHelper.instance;
  }

  public goToInitialScreen = async (): Promise<void> => {
    const didShowUserAgreement: boolean = false;
    // 是否同意用户协议
    if (didShowUserAgreement === false) {
      await this.setUserAgreementScreenAsRoot();
    } else {
      AppRootHelper.shared().goToBottomTabs();
    }
  };

  /**
   *  跳转用户协议页面
   */
  private setUserAgreementScreenAsRoot = async (): Promise<void> => {
    return new Promise((resolve, _reject) => {
      navigationRef.reset({
        index: 0,
        routes: [{ name: ScreenConstants.UserAgreement }],
      });
    });
  };

  /**
   * 跳转主页面
   */
  goToBottomTabs = async () => {
    // 去主界面
    await initBeforeEnteringHome();
    // 初始化三方SDK
    await initThirdSDKBeforeEnteringHome();
    navigationRef.reset({
      index: 0,
      routes: [{ name: ScreenConstants.HomeTabs }],
    });
    // 业务层相关初始化，比如检查更新
    await initAfterEnteringHome();
    // 其他不需要在主界面的初始化业务
    await initAfterEnteringHomeWithDelay();
  };
}
