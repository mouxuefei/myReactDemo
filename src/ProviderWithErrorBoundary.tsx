/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { Provider } from 'react-redux';

const FallBackComponent = (props: FallbackProps) => {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        contentInsetAdjustmentBehavior={'always'}
      >
        {/* <Image source={require('./images/blank_404.png')} /> */}
        <Text style={styles.title}>{'页面加载出错啦'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
    maxWidth: '65%',
    textAlign: 'center',
  },
});

/**
 *  typeScript出错之后展示的页面。给用户一个友好的提示
 */
export const ProviderWithErrorBoundary = ({
  store,
  children,
}: {
  store: any;
  children: any;
}) => {
  /**
   * 上报报错信息
   */
  const handleError = useCallback(
    (
      error: Error,
      info: {
        componentStack: string;
      }
    ) => {
      // Bugly.recordException({
      //   message: error.message,
      //   parsedStack: [],
      //   stackStrInfo: info.componentStack,
      // });
    },
    []
  );

  const { componentId } = children?.props || {};

  return (
    <Provider store={store}>
      {/* @ts-ignore */}
      <ErrorBoundary
        FallbackComponent={FallBackComponent}
        onError={handleError}
      >
        {children}
      </ErrorBoundary>
    </Provider>
  );
};
