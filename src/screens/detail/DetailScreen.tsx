import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BTouchable } from '../../components/BTouchable';
import { updateDidCheckIn } from '../../redux/modules/actions';
import { login } from '../../redux/modules/userInfo';
interface Props {}
export const DetailScreen = (props: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onPress = useCallback(() => {
    // dispatch(login({}));
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <BTouchable style={{ height: 60 }} onPress={onPress}>
        <Text>DetailScreen</Text>
      </BTouchable>
    </View>
  );
};
