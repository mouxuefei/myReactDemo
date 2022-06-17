import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { httpServer } from '../../api';
import { BaseResponse } from '../../api/FetchInfo';
import { BTouchable } from '../../components/BTouchable';
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
    navigation.navigate(ScreenConstants.Upgrade);
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
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
      <Text>{test}</Text>
    </View>
  );
};
