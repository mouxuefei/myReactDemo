// https://github.com/react-navigation/react-navigation/issues/9741
export type RootStackParamList = {
  Splash: undefined;
  Detail: undefined;
  UserAgreement: undefined;
  Home: undefined;
  Personal: undefined;
  Upgrade: undefined;
  HomeTabs: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
