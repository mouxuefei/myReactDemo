import { ShadowView } from '@dimaportenko/react-native-shadow-view';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Text, View, Alert } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { BTouchable } from '../../components/BTouchable';
import { navigationRef } from '../../navigation/RootNavigation';
import { Colors } from '../../styles/colors';
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
    navigation.push(ScreenConstants.Detail);
    // navigationRef.reset({
    //   routes: [
    //     { name: ScreenConstants.HomeTabs },
    //     { name: ScreenConstants.Detail },
    //   ],
    //   index: 0,
    // });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <BTouchable
        style={{ height: 60, backgroundColor: Colors.color2F3032 }}
        onPress={onPress}
      >
        <Text>HomeScreen</Text>
      </BTouchable>
      <View style={{ marginLeft: 20 }}>
        <ShadowView
          style={[
            {
              width: 100,
              height: 100,
              margin: 40,
            },
            {
              shadowColor: 'blue',
              shadowOffset: {
                width: 1,
                height: 8,
              },
              shadowOpacity: 0.5,
            },
          ]}
        >
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: 'blue',
            }}
          >
            <View style={{ width: 80 }} />
          </View>
        </ShadowView>
      </View>
    </View>
  );
};
