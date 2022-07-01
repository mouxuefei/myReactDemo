import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { screensEnabled } from 'react-native-screens';
import { useDispatch } from 'react-redux';
import { httpServer } from '../../api';
import { BaseResponse } from '../../api/FetchInfo';
import { BTouchable } from '../../components/BTouchable';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { navigate } from '../../navigation/RootNavigation';
import { updateDidCheckIn } from '../../redux/modules/actions';
import { login } from '../../redux/modules/userInfo';
import { ScreenConstants } from '../ScreenConstants';
import { HomeDTO } from './api/dto';
import { HomeFI } from './api/HomeFI';

interface Props {}
export const HomeScreen = (props: Props) => {
  const [test, setTest] = useState<string>('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  });

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('tabPress', e => {
  //     console.log('e====', e);
  //     // 根据逻辑阻止切换
  //     e.preventDefault();

  //     // alert('Default behavior prevented');
  //     // Do something manually
  //     // ...
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const fetchData = useCallback(async () => {
    const articleInfo = HomeFI.article();
    const response: BaseResponse<HomeDTO> =
      await httpServer.promiseFetch<HomeDTO>(articleInfo);
    console.log('response==', response);

    if (response.success) {
      setTest(JSON.stringify(response));
    } else {
      // 失败
    }
  }, []);

  const onPress = useCallback(() => {
    fetchData();
    // dispatch(login({}));
    // navigation.navigate(ScreenConstants.Upgrade);
  }, [fetchData]);

  const onPressButton = useCallback(() => {
    navigation.navigate(ScreenConstants.ClassifyPage);
  }, [navigation]);

  const [enableScroll, setEnableScroll] = useState<boolean>(true);
  console.log('enableScroll===', enableScroll);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatlistRef = useRef<FlatList>(null);
  const flatlistRef2 = useRef<FlatList>(null);
  const spin = fadeAnim.interpolate({
    inputRange: [0, 200, 250],
    outputRange: [0, -100, -100],
  });
  const spin2 = fadeAnim.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 200],
  });

  const headerHeight = 400;

  const height = fadeAnim.interpolate({
    inputRange: [0, headerHeight, 500],
    outputRange: [headerHeight, 50, 50],
  });

  let isLeft = true;
  return (
    <Animated.View style={{ flex: 1 }}>
      <Animated.View
        style={{
          height: height,
          backgroundColor: 'red',
        }}
      >
        <BTouchable
          style={{ height: 60, backgroundColor: 'green' }}
          onPress={onPress}
        >
          <Text>button1</Text>
        </BTouchable>
        <BTouchable
          style={{ height: 60, backgroundColor: 'red' }}
          onPress={onPressButton}
        >
          <Text>button2</Text>
        </BTouchable>
      </Animated.View>
      <Animated.View
        style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}
      >
        <FlatList
          ref={flatlistRef}
          scrollEnabled={true}
          style={{ width: 20 }}
          onTouchStart={() => {
            isLeft = true;
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: fadeAnim } } }],
            {
              listener: event => {
                if (isLeft) {
                  const y = event.nativeEvent.contentOffset.y;
                  if (y >= 0) {
                    if (y < 200) {
                      flatlistRef2?.current?.scrollToOffset({
                        animated: false,
                        offset: Math.round(y),
                      });
                      console.log(
                        'aaaaa====',
                        event.nativeEvent.contentOffset.y
                      );
                    } else {
                      flatlistRef2?.current?.scrollToOffset({
                        animated: false,
                        offset: headerHeight,
                      });
                    }
                  }
                }
              },
            } // Optional async listener
          )}
          data={[12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]}
          renderItem={() => {
            return (
              <View
                style={{
                  height: 200,
                  backgroundColor: 'blue',
                  marginBottom: 10,
                }}
              ></View>
            );
          }}
        />
        <FlatList
          ref={flatlistRef2}
          scrollEnabled={true}
          style={{ width: 40 }}
          onTouchStart={() => {
            isLeft = false;
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: fadeAnim } } }],
            {
              listener: event => {
                if (isLeft === false) {
                  const y = event.nativeEvent.contentOffset.y;
                  if (y >= 0) {
                    if (y < 200) {
                      flatlistRef?.current?.scrollToOffset({
                        animated: false,
                        offset: Math.round(y),
                      });
                    } else {
                      flatlistRef?.current?.scrollToOffset({
                        animated: false,
                        offset: headerHeight,
                      });
                    }
                    console.log('bbbb====', event.nativeEvent.contentOffset.y);
                  }
                }
              },
            } // Optional async listener
          )}
          data={[12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]}
          renderItem={() => {
            return (
              <View
                style={{
                  height: 200,
                  backgroundColor: 'green',
                  marginBottom: 10,
                }}
              ></View>
            );
          }}
        />
      </Animated.View>
    </Animated.View>
  );
};
