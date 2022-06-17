import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View } from 'react-native';
import { defaultNavTheme } from './navigation/DefaultNavTheme';
import { store } from './redux/store/Store';
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

interface Props {
  data1?: string;
  data2?: string;
}
export const AppContainer = (props: Props) => {
  console.log('bundle====', props?.data1);

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
            screenOptions={{ animation: 'fade' }}
          >
            {/*  homeTabs */}
            <Stack.Screen
              name={ScreenConstants.HomeTabs}
              options={{ headerShown: false }}
            >
              {() => (
                <Tab.Navigator screenOptions={tabNavigatorOption}>
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

const tabNavigatorOption = (param: { route: RouteProp<any> }) => ({
  tabBarIcon: (param2: { focused: boolean; color: string; size: number }) => {
    let iconName;
    if (param.route.name === ScreenConstants.Detail) {
      return (
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: 'white',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            style={{
              width: 30,
              height: 30,
            }}
            source={require('./images/home/home.png')}
          />
        </View>
      );
    }
    return (
      <Image
        style={{
          width: 20,
          height: 20,
        }}
        source={require('./images/home/home.png')}
      />
    );
  },
  tabBarActiveTintColor: 'tomato',
  tabBarInactiveTintColor: 'gray',
  headerShown: false,
  tabBarItemStyle: { marginBottom: 3 },
});
