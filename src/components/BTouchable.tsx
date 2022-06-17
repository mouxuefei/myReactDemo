import React, { PureComponent } from 'react';
import {
  GestureResponderEvent,
  Platform,
  StyleProp,
  StyleSheet,
  ThemeAttributeBackgroundPropType,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from 'react-native';

interface Props extends OptionalProps, TouchableWithoutFeedbackProps {}

interface OptionalProps {
  borderless?: boolean;

  /**
   * 代表是否正在操作中，为true的时候不可触发事件，防止用户重复操作
   */
  isLoading?: boolean;

  /**
   * 是否包含Touchable的children，默认false。
   * 当HTouchable中的Touchable无法点击的时候，设置为true即可。
   * 默认false，为了保证Android上点击波纹效果从点击的位置开始做动画，不然开始位置是不固定的。
   */
  hasTouchableChildren?: boolean;
}

/**
 * 封装之后的touchable
 */
export class BTouchable extends PureComponent<Props> {
  static defaultProps: OptionalProps = {
    borderless: false,
    isLoading: false,
    hasTouchableChildren: false,
  };

  lastTimeStamp = 0;

  render() {
    const { style, borderless } = this.props;
    const borderlessStyle: StyleProp<ViewStyle> =
      borderless === true && Platform.OS === 'android'
        ? { overflow: 'visible' }
        : null;
    const finalStyle = [style, { ...borderlessStyle }];
    return Platform.select({
      ios: this.renderIOS(finalStyle),
      android: this.renderAndroid(finalStyle),
    });
  }

  private renderAndroid = (finalStyle: StyleProp<ViewStyle>) => {
    const { borderless, children, hasTouchableChildren } = this.props;
    let background: ThemeAttributeBackgroundPropType;
    if (Platform.Version >= 21) {
      background = borderless
        ? TouchableNativeFeedback.SelectableBackgroundBorderless()
        : TouchableNativeFeedback.SelectableBackground();
    } else {
      background = TouchableNativeFeedback.SelectableBackground();
    }

    return (
      <TouchableNativeFeedback
        // more native
        // https://github.com/facebook/react-native/issues/6139#issuecomment-225281434
        delayPressIn={0}
        background={background}
        useForeground={TouchableNativeFeedback.canUseNativeForeground()}
        {...this.props}
        style={null}
        disabled={this.isTouchDisabled()}
        onPress={this.customOnPress}
      >
        <View
          style={[styles.androidContentContainer, finalStyle]}
          pointerEvents={hasTouchableChildren ? 'box-none' : 'box-only'}
        >
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  };

  private renderIOS = (finalStyle: StyleProp<ViewStyle>) => {
    const { children } = this.props;

    return (
      <TouchableOpacity
        {...this.props}
        style={finalStyle}
        disabled={this.isTouchDisabled()}
        onPress={this.customOnPress}
        activeOpacity={0.6}
      >
        {children}
      </TouchableOpacity>
    );
  };

  private customOnPress = (event: GestureResponderEvent) => {
    const currentTimeStamp = new Date().getTime();
    const shouldResponse =
      this.lastTimeStamp === 0 || currentTimeStamp - this.lastTimeStamp > 500;
    if (shouldResponse) {
      this.lastTimeStamp = currentTimeStamp;
      const { onPress } = this.props;
      if (onPress) {
        onPress(event);

        // this.debugTestID();
      }
    }
  };

  /**
   * 点击事件是否真正禁用
   * - disable是Touchable自己的属性，为true不可点击
   * - isLoading代表是否有操作正在进行，为true不可点击，防止重复点击
   */
  private isTouchDisabled = (): boolean => {
    const { disabled, isLoading } = this.props;
    return (disabled ?? false) || (isLoading ?? false);
  };
}

const styles = StyleSheet.create({
  androidContentContainer: {
    overflow: 'hidden',
  },
});
