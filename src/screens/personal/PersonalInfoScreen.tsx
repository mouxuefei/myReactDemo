import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Text, View, Alert } from 'react-native';
import { BTouchable } from '../../components/BTouchable';
import { ScreenConstants } from '../ScreenConstants';
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
    navigation.navigate(ScreenConstants.Detail);
  }, [navigation]);
  return (
    <View>
      <BTouchable style={{ height: 60 }} onPress={onPress}>
        <Text>HomeScreen</Text>
      </BTouchable>
    </View>
  );
};
