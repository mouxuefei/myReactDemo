import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { StyleSheet, Image, View, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AppRootHelper } from '../../AppRootHelper';
interface Props {}

export const SplashScreen: FC<Props> = (props: Props) => {
  useEffect(() => {
    setTimeout(() => {
      AppRootHelper.shared().goToInitialScreen();
    }, 2000);
  });

  return (
    <View style={styles.container}>
      <Animatable.View
        style={styles.background}
        animation={'zoomIn'}
        duration={1000}
      >
        <Image
          style={styles.logo}
          source={{
            uri: 'https://logos-world.net/wp-content/uploads/2021/02/Sky-Logo-1989-1993.png',
          }}
        />
      </Animatable.View>
    </View>
  );
};

const fixStatusBar = () => {};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {},
  logo: {
    width: 150,
    height: 150,
  },
});
