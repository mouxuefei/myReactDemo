import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { Provider } from 'react-redux';
import DeviceInfo, { isTablet } from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './screens/home/HomeScreen';
import { PersonalInfoScreen } from './screens/personal/PersonalInfoScreen';
import { SplashScreen } from './screens/splash/SplashScreen';
import { defaultNavTheme } from './navigation/config/DefaultNavTheme';
import { store } from './redux/store/configureStore';
import { DetailScreen } from './screens/detail/DetailScreen';
import { navigationRef } from './navigation/RootNavigation';
import { ProviderWithErrorBoundary } from './ProviderWithErrorBoundary';
import { UserAgreementScreen } from './screens/userAgreement/UserAgreementScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const AppContainer = () => {
  return (
    <ProviderWithErrorBoundary store={store}>
      <NavigationContainer theme={defaultNavTheme} ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={'splash'}
          screenOptions={{
            headerShadowVisible: false, // android 导航去阴影 默认true开启状态
            headerTitleAlign: 'center', // 标题居中 默认 'left'
            headerTitle: '标题', //全局标题 在此设置是不生效的 默认展示路由页面的name
            // 设置导航栏字体样式
            headerTitleStyle: {
              fontSize: 17,
              color: '#333333',
              fontFamily: 'PingFangSC-Semibold',
              fontWeight: '700',
            },
            headerTintColor: 'red', // 导航栏字体颜色设置 如果设置了headerTitleStyle则此处设置不生效
            statusBarStyle: 'dark', //"inverted" | "auto" | "light" | "dark" | undefined 状态栏配置
          }}
        >
          <Stack.Screen name='splash' component={SplashScreen} />
          <Stack.Screen name='userAgreement' component={UserAgreementScreen} />
          <Stack.Screen name={'HomeTabs'} options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen name='Home' component={HomeScreen} />
                <Tab.Screen name='personal' component={PersonalInfoScreen} />
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name='detail' component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProviderWithErrorBoundary>
  );
};
