/**
 * 所有页面的名字,为了navigation调用的时候不报错，需要到global.d.ts里面对应进行配置
 * https://github.com/react-navigation/react-navigation/issues/9741
 */
export enum ScreenConstants {
  Splash = 'Splash',
  UserAgreement = 'UserAgreement',
  Home = 'Home',
  Personal = 'Personal',
  Upgrade = 'Upgrade',
  HomeTabs = 'HomeTabs',
  Detail = 'Detail',
  Detail2 = 'Detail2',
  Detail3 = 'Detail3',
  ClassifyPage = 'ClassifyPage',
}
