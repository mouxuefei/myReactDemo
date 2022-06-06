import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Text, View, Alert } from 'react-native';
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

  return (
    <View>
      <Text style={{ color: 'black' }}>PersonalInfoScreen</Text>
    </View>
  );
};
