import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Splash: undefined;
  UserAgreement: undefined;
  Home: undefined;
  Personal: undefined;
  Upgrade: undefined;
  HomeTabs: undefined;
  Detail: { id: number };
  Detail2: { id: number };
  Detail3: { id: number };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
