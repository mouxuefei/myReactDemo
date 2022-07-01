import React, { FC, PureComponent, ReactElement, ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { BTouchable } from './BTouchable';

export type Source = {
  source?: any | null;
  title?: string | null;
  description?: string | null;
  onPress?: () => void;
  render?: () => ReactElement;
  imageStyle?: StyleProp<ImageStyle>;
};

export type EmptyViewStateConfig = Source;

export type EmptyViewState = 'normal' | 'empty' | 'loading' | 'failure';

interface Props {
  state: EmptyViewState;
  empty?: Source;
  failure?: Source;
  loading?: Source;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle> | null;
  enableSafeContainer?: boolean;
}

export const MultiContainer: FC<Props> = (props: Props) => {
  const {
    state,
    empty,
    failure,
    loading,
    style,
    enableSafeContainer,
    children,
  } = props;
  const newProps = { ...props };
  delete newProps.style;
  delete newProps.children;

  const Container = enableSafeContainer ? SafeAreaView : View;

  if (state === 'empty') {
    if (!empty?.render) {
      return (
        <Container style={styles.safeContainer}>
          <View style={[styles.container, style]} {...newProps}>
            <View style={styles.empty}>
              <Image style={empty?.imageStyle ?? null} source={empty?.source} />
              <Text style={styles.emptyTitle}>
                {empty?.title || '暂无数据'}
              </Text>
              <Text style={styles.description}>{empty?.description}</Text>
            </View>
          </View>
        </Container>
      );
    }
    return empty?.render();
  }

  if (state === 'loading') {
    if (!loading?.render) {
      return (
        <Container style={styles.safeContainer}>
          <View style={[styles.container, style]} {...newProps}>
            <ActivityIndicator />
          </View>
        </Container>
      );
    }
    return loading.render();
  }

  if (state === 'failure') {
    if (!failure?.render) {
      return (
        <Container style={styles.safeContainer}>
          <BTouchable
            testID={'1625739227'}
            style={styles.touchable}
            onPress={failure?.onPress}
          >
            <View style={[styles.container, style]} {...newProps}>
              <View style={styles.empty}>
                <Image source={failure?.source} />
                <Text style={styles.title}>
                  {failure?.title ? failure.title : '请求失败'}
                </Text>
                <Text style={styles.description}>
                  {failure?.description ?? '点击重新加载'}
                </Text>
              </View>
            </View>
          </BTouchable>
        </Container>
      );
    }
    return failure.render();
  }

  return (
    <Container style={styles.safeContainer}>
      <View style={[styles.subContainer, style]} {...newProps}>
        {children}
      </View>
    </Container>
  );
};

MultiContainer.defaultProps = {
  empty: {},
  failure: {},
  loading: {},
  style: null,
  enableSafeContainer: false,
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  subContainer: { flex: 1 },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
  description: {
    fontSize: 12,
    color: '#999999',
    marginTop: 10,
  },
  touchable: {
    flex: 1,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#999999',
  },
});
