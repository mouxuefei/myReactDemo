import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { defaultNavTheme } from './navigation/DefaultNavTheme';
import { store } from './redux/store/configureStore';
import { navigationRef } from './navigation/RootNavigation';
import { ProviderWithErrorBoundary } from './ProviderWithErrorBoundary';
import { defaultNavOptionsConfig } from './navigation/DefaultNavOptionsConfig';
import {
  bottomTabPages,
  modalPages,
  RouterConfig,
  stackPages,
} from './screens';
import { ScreenConstants } from './screens/ScreenConstants';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const AppContainer = () => {
  return (
    <ProviderWithErrorBoundary store={store}>
      <NavigationContainer theme={defaultNavTheme} ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={ScreenConstants.Splash}
          screenOptions={defaultNavOptionsConfig}
        >
          {/*  screen */}
          <Stack.Group
            navigationKey={'screen'}
            screenOptions={{
              animation: 'fade',
            }}
          >
            {/*  homeTabs */}
            <Stack.Screen
              name={ScreenConstants.HomeTabs}
              options={{ headerShown: false }}
            >
              {() => (
                <Tab.Navigator screenOptions={{ headerShown: false }}>
                  {bottomTabPages.map(item => {
                    return registerScreen(item, true);
                  })}
                </Tab.Navigator>
              )}
            </Stack.Screen>
            {stackPages.map(item => {
              return registerScreen(item);
            })}
          </Stack.Group>
          {/*  modal */}
          <Stack.Group
            navigationKey={'modal'}
            screenOptions={{
              presentation: 'modal',
              animation: 'fade_from_bottom',
              headerShown: false,
            }}
          >
            {modalPages.map(item => {
              return registerScreen(item);
            })}
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </ProviderWithErrorBoundary>
  );
};

const registerScreen = (routerConfig: RouterConfig, isTab?: boolean) => {
  const Screen = isTab ? Tab.Screen : Stack.Screen;
  return (
    <Screen
      key={routerConfig.route}
      name={routerConfig.route}
      component={routerConfig.page}
      options={routerConfig.navigationOptions ?? null}
    />
  );
};
