import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { BTouchable } from './components/BTouchable';

export const App = () => {
  return (
    <SafeAreaView style={styles.sectionContainer}>
      <BTouchable>
        <Text>aaa</Text>
      </BTouchable>
      <BTouchable>
        <Text style={{ color: 'black' }}>aaa</Text>
      </BTouchable>
      <BTouchable>
        <Text>aaa</Text>
      </BTouchable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 24,
  },
});
