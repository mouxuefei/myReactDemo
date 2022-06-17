import { ScreenConstants } from './ScreenConstants';
import { DetailScreen } from './detail/DetailScreen';
import { HomeScreen } from './home/HomeScreen';
import { UpgradeModal } from './modals/upgrade/UpgradeModal';
import { PersonalInfoScreen } from './personal/PersonalInfoScreen';
import { SplashScreen } from './splash/SplashScreen';
import { UserAgreementScreen } from './userAgreement/UserAgreementScreen';
import { DetailScreen2 } from './detail/DetailScreen2';
import { DetailScreen3 } from './detail/DetailScreen3';
export interface RouterConfig {
  route: string; // 页面路由
  page: React.ComponentType<any>; // 页面
  navigationOptions?: any; // 导航参数
}

/**
 * 普通页面
 */
export const stackPages: Array<RouterConfig> = [
  {
    route: ScreenConstants.Splash,
    page: SplashScreen,
  },
  {
    route: ScreenConstants.UserAgreement,
    page: UserAgreementScreen,
  },
  {
    route: ScreenConstants.Detail,
    page: DetailScreen,
  },
  {
    route: ScreenConstants.Detail2,
    page: DetailScreen2,
  },
  {
    route: ScreenConstants.Detail3,
    page: DetailScreen3,
  },
];
/**
 * 底部bottom
 */
export const bottomTabPages: Array<RouterConfig> = [
  {
    route: ScreenConstants.Home,
    page: HomeScreen,
  },
  {
    route: ScreenConstants.Detail,
    page: DetailScreen,
  },
  {
    route: ScreenConstants.Personal,
    page: PersonalInfoScreen,
  },
];

/**
 * modal
 */
export const modalPages: Array<RouterConfig> = [
  {
    route: ScreenConstants.Upgrade,
    page: UpgradeModal,
  },
];
