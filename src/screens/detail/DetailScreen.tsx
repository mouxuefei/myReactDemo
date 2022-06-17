import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BTouchable } from '../../components/BTouchable';
import { updateDidCheckIn } from '../../redux/modules/actions';
import { login } from '../../redux/modules/userInfo';
import { Colors } from '../../styles/colors';
import { RootStackScreenProps } from '../global';
import { ScreenConstants } from '../ScreenConstants';
interface Props {}
export const DetailScreen = (props: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootStackScreenProps<any>>();
  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation]
  );
  const onPress = useCallback(() => {
    navigation.push(ScreenConstants.Detail2, { id: 123 });
  }, [dispatch]);

  const onPressBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'gray' }}>
      <BTouchable
        style={{ height: 60, backgroundColor: Colors.color2F3032 }}
        onPress={onPress}
      >
        <Text>goto detail2</Text>
      </BTouchable>
      <BTouchable
        style={{ height: 60, backgroundColor: Colors.colorFF7373 }}
        onPress={onPressBack}
      >
        <Text>goback</Text>
      </BTouchable>
      <Text style={{ fontSize: 40 }}>goto detail</Text>
    </View>
  );
};
