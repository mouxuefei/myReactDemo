import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './screens/home/HomeScreen';
import { PersonalInfoScreen } from './screens/personal/PersonalInfoScreen';
import { SplashScreen } from './screens/splash/SplashScreen';
import { defaultNavTheme } from './navigation/config/DefaultNavTheme';
import { store } from './redux/store/configureStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const App = () => {
  const [isLoadingSplash, setIsLoadingSplash] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingSplash(false);
    }, 2000);
  });

  return isLoadingSplash ? (
    <SplashScreen />
  ) : (
    <Provider store={store}>
      <NavigationContainer theme={defaultNavTheme}>
        <Stack.Navigator initialRouteName={'home'}>
          <Tab.Screen name={'home'} component={HomeScreen}></Tab.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Stack.Screen name={'Home'} component={HomeScreen} />
      <Stack.Screen name={'personalInfo'} component={PersonalInfoScreen} />
    </Tab.Navigator>
  );
};
