import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BTouchable } from '../../components/BTouchable';
import { navigate } from '../../navigation/RootNavigation';
import { updateDidCheckIn } from '../../redux/modules/actions';
import { login } from '../../redux/modules/userInfo';
import { ScreenConstants } from '../ScreenConstants';
interface Props {}
export const HomeScreen = (props: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    // dispatch(login({}));
    navigation.navigate(ScreenConstants.Upgrade);
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <BTouchable style={{ height: 60 }} onPress={onPress}>
        <Text>HomeScreen</Text>
      </BTouchable>
      <View style={{ height: 100, backgroundColor: 'red' }}>
        <Text>HomeScreen</Text>
      </View>
      <Text>HomeScreen</Text>
      <Text>HomeScreen</Text>
      <Text>HomeScreen</Text>
      <Text>HomeScreen</Text>
      <Text>HomeScreen</Text>
      <View style={{ height: 100, backgroundColor: 'green' }}>
        <Text>HomeScreen</Text>
      </View>
      <View style={{ height: 100, backgroundColor: 'red' }}>
        <Text>HomeScreen</Text>
      </View>
    </View>
  );
};
