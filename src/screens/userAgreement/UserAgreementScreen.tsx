import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Text, View, Alert } from 'react-native';
import { BTouchable } from '../../components/BTouchable';
interface Props {}
export const UserAgreementScreen = (props: Props) => {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'HomeTabs' }],
    });
  }, [navigation]);
  return (
    <View>
      <Text style={{ color: 'black' }}>
        UserAgreementScreenUserAgreementScreenUse
        rAgreementScreenUserAgreementScreenUserAg
        reementScreenUserAgreementScreen
      </Text>
      <BTouchable
        onPress={onPress}
        style={{ alignItems: 'center', height: 120, justifyContent: 'center' }}
      >
        <Text>同意</Text>
      </BTouchable>
    </View>
  );
};
