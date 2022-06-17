import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BTouchable } from '../../components/BTouchable';
import { updateDidCheckIn } from '../../redux/modules/actions';
import { login } from '../../redux/modules/userInfo';
import { Colors } from '../../styles/colors';
import { RootStackScreenProps } from '../global';
import { ScreenConstants } from '../ScreenConstants';
interface Props {}
export const DetailScreen3 = (props: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootStackScreenProps<any>>();

  const onPressBack = useCallback(() => {
    navigation.navigate(ScreenConstants.Detail, { id: 1 });
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'gray' }}>
      <BTouchable
        style={{ height: 60, backgroundColor: Colors.colorFF7373 }}
        onPress={onPressBack}
      >
        <Text>goback</Text>
      </BTouchable>
      <Text style={{ fontSize: 40 }}>goto detail3</Text>
    </View>
  );
};
