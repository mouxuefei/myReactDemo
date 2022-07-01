import { ShadowView } from '@dimaportenko/react-native-shadow-view';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { Text, View, Alert, StatusBar, Animated } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { BTouchable } from '../../components/BTouchable';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { NestedScrollView } from '../../components/NestedScrollView';
import { YTNestedScrollView } from '../../components/YTNestedScrollView';
import { navigationRef } from '../../navigation/RootNavigation';
import { Colors } from '../../styles/colors';
import { ScreenConstants } from '../ScreenConstants';
import { TestView } from './TestView';

interface Props {}
export const PersonalInfoScreen = (props: Props) => {
  // 焦点
  useFocusEffect(
    React.useCallback(() => {
      // 类似didAppear
      // Alert.alert('Screen was focused');
      return () => {
        // Alert.alert('Screen was unfocused');
      };
    }, [])
  );

  // 是否有焦点
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  const onPress = useCallback(() => {
    navigation.push(ScreenConstants.Detail);
    // navigationRef.reset({
    //   routes: [
    //     { name: ScreenConstants.HomeTabs },
    //     { name: ScreenConstants.Detail },
    //   ],
    //   index: 0,
    // });
  }, []);

  const renderHeader = useCallback(() => {
    return <View style={{ height: 200, backgroundColor: 'green' }}></View>;
  }, []);

  const [scrollY] = useState<Animated.Value>(new Animated.Value(0));
  const textRef = useRef(null);
  const onScrollMJ = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: e => {
        const y = e.nativeEvent.contentOffset.y;
        console.log('textRef==', textRef.current);

        // textRef.current.scrollTo({
        //   animated: false,
        //   y: y,
        // });
        console.log('e===', e.nativeEvent.contentOffset.y);
      },
    }
  );
  return (
    <View style={{ flex: 1 }}>
      {/* <FocusAwareStatusBar barStyle={'dark-content'} /> */}
      <YTNestedScrollView renderHeader={renderHeader}>
        <TestView
          titleLabel={'aa'}
          onScrollView={onScrollMJ}
          scrollRef={textRef}
        />
        <TestView titleLabel={'bb'} />
      </YTNestedScrollView>
    </View>
  );
};
