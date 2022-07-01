import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  View,
  StatusBar,
  Text,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AppRootHelper } from '../../AppRootHelper';
import { MessageList } from '../detail/Message';
import { NativeModules } from 'react-native';
const { RNChatLibModule } = NativeModules;
import { BTouchable } from '../../components/BTouchable';
import { MessageListView } from '../detail/MessageListView';
import { MultiContainer } from '../../components/MultiContainer';
interface Props {}

export const SplashScreen: FC<Props> = (props: Props) => {
  useEffect(() => {
    setTimeout(() => {
      AppRootHelper.shared().goToInitialScreen();
    }, 2000);
  });

  const onPress = useCallback(() => {
    RNChatLibModule.stopPlayVoice();
  }, []);

  return (
    <MultiContainer style={styles.container} state={'normal'}>
      {/* <BTouchable onPress={onPress}>
        <Text>aaaa</Text>
      </BTouchable>
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
      </Animatable.View> */}
      <MessageListView
        style={{ flex: 1, backgroundColor: 'green' }}
        initList={[
          { msgId: '11', msgType: 1, text: '1111' },
          { msgId: '11', msgType: 2, text: '第四条消息' },
          { msgId: '11', msgType: 3, text: '第三条消息' },
          { msgId: '11', msgType: 0, text: '第二条消息' },
          { msgId: '11', msgType: 1, text: '第一条消息' },
          { msgId: '11', msgType: 2, text: '第四条消息' },
          { msgId: '11', msgType: 3, text: '第三条消息' },
          { msgId: '11', msgType: 0, text: '第二条消息' },
          { msgId: '11', msgType: 1, text: '第一条消息' },
          { msgId: '11', msgType: 2, text: '第四条消息' },
          { msgId: '11', msgType: 3, text: '第三条消息' },
          { msgId: '11', msgType: 1, text: '第二条消息' },
          { msgId: '11', msgType: 0, text: '第一条消息' },
          { msgId: '11', msgType: 1, text: '第一条消息' },
          { msgId: '11', msgType: 1, text: '第四条消息' },
          { msgId: '11', msgType: 2, text: '第三条消息' },
          { msgId: '11', msgType: 2, text: '第二条消息' },
          { msgId: '11', msgType: 1, text: '第一条消息' },
          { msgId: '11', msgType: 3, text: '第四条消息' },
          { msgId: '11', msgType: 1, text: '第三条消息' },
          { msgId: '11', msgType: 3, text: '第二条消息' },
          { msgId: '11', msgType: 1, text: '第一条消息' },
        ]}
        jsClick={(data: any) => {
          console.log('aaa========================', data.nativeEvent);
        }}
      />
      <View style={{ height: 100, backgroundColor: 'red' }}></View>
    </MultiContainer>
  );
};

const fixStatusBar = () => {};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {},
  logo: {
    width: 150,
    height: 150,
  },
});
