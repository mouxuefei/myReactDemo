import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BTouchable } from '../../components/BTouchable';
import { updateDidCheckIn } from '../../redux/modules/actions';
import { login } from '../../redux/modules/userInfo';
interface Props {}
export const HomeScreen = (props: Props) => {
  const dispatch = useDispatch();

  const onPress = useCallback(() => {
    dispatch(login({}));
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <BTouchable style={{ height: 60 }} onPress={onPress}>
        <Text>aaa</Text>
      </BTouchable>
    </View>
  );
};
