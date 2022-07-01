import {
  FlatList,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
export function instanceOfInterface<T>(
  object: any,
  checkFunction?: () => boolean
): object is T {
  if (Array.isArray(object)) {
    if (object.length === 0) return true;
    return instanceOfInterface(object[0]);
  }
  return checkFunction ? checkFunction() : Object.keys(object).length > 0;
}
export type EnhancedReactInstance = {
  _yt_unique_footer_ref?: View;
  getScrollRef?: () => ScrollView | FlatList | null | undefined;
};

// 统一给函数添加额外 footer
export const listFooterComponent = (
  obj: EnhancedReactInstance,
  renderUserFooter?: any
) => {
  const viewStyle: StyleProp<ViewStyle> = {
    width: '100%',
  };

  const setViewRef = (ref: View) => {
    // eslint-disable-next-line no-param-reassign
    obj._yt_unique_footer_ref = ref;
  };

  return (
    <View>
      {typeof renderUserFooter === 'function' && renderUserFooter()}
      <View style={viewStyle} ref={setViewRef} />
    </View>
  );
};

// 处理 YTNestedScrollView 回调
export const onMessage = (
  obj: (ScrollViewProps & EnhancedReactInstance) | undefined,
  message: NestedScrollViewMessage,
  clearTimeout: (timer: NodeJS.Timeout) => void
) => {
  if (!obj) {
    return {
      timer: null,
      success: false,
    };
  }
  const { type, data } = message;
  switch (type) {
    case MessageType.appendContentSize: {
      obj._yt_unique_footer_ref &&
        obj._yt_unique_footer_ref.setNativeProps({
          style: { height: data },
        });

      return {
        timer: null,
        success: !!obj._yt_unique_footer_ref,
      };
    }
    case MessageType.setContentOffset: {
      let scrollRef: ScrollView | FlatList | null | undefined = null;
      if (typeof obj.getScrollRef === 'function') {
        scrollRef = obj.getScrollRef();
      }
      const timer: NodeJS.Timeout = setTimeout(() => {
        if (
          scrollRef &&
          instanceOfInterface<ScrollView>(scrollRef) &&
          typeof scrollRef.scrollTo === 'function' &&
          typeof data !== 'number'
        ) {
          scrollRef.scrollTo({
            animated: !!data.animated,
            x: data.x,
            y: data.y,
          });
        } else if (
          scrollRef &&
          instanceOfInterface<FlatList>(scrollRef) &&
          typeof scrollRef.scrollToOffset === 'function' &&
          typeof data !== 'number'
        ) {
          scrollRef.scrollToOffset({
            animated: !!data.animated,
            offset: data.y,
          });
        }
        clearTimeout(timer);
      }, 1);
      return {
        success: !!scrollRef,
        timer,
      };
    }
    default:
      return {
        timer: null,
        success: false,
      };
  }
};

// 防抖函数: 在一段时间内, 只会执行一次, 如果重复回调, 那么后面的会替换掉之前的回调, 从新开始计时, 只会以最后一次为准
// 例子: wait = 100, 如果一个函数每 1ms 回调一次, 那么只有当其中两次回调大于 100ms 或者回调结束了才会执行一次.
// 第三个参数就是设置是否立即生效, 第一次不进入延时
// export const debounds = (fn, wait, immediate = false) => {
//   let timeout;
//   return (...args) => {
//     const next = () => fn && fn(...args);

//     const callnow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       next();
//       timeout = null;
//     }, wait);
//     callnow && next();
//   };
// };

// 为 YTNestedScollview 定制的, 新增判断条件, 只有当 args 中 deboundsFlag == true 的时候才进行防抖
export const debounceWithFlag = (
  fn: Function,
  wait: number,
  immediate = false
) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    const deboundsFlag = [...args].some(
      v => typeof v === 'object' && v.deboundsFlag === true
    );
    const newargs = [...args].filter(
      v => !(typeof v === 'object' && v.deboundsFlag !== null)
    );
    const next = () => fn && fn(...newargs);

    const callnow = immediate && !timeout;
    deboundsFlag && timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      next();
      timeout = null;
    }, wait);
    callnow && next();
  };
};

// 节流函数: 在一段时间内, 只会执行一次, 如果重复回调, 忽略掉之后的回调, 只有当达到定时后才开始响应下一个回调
// 例子: wait == 100, 如果一个函数每 1ms 回调一次, 那么每100 ms 才会响应一次
// 第三个参数就是设置是否立即生效, 第一次不进入延时
export const throttle = (fn: Function, wait: number, immediate = false) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    const next = () => fn && fn(...args);
    const callnow = immediate && !timeout;
    if (!timeout) {
      timeout = setTimeout(() => {
        next();
        timeout = null;
      }, wait);
    }
    callnow && next();
  };
};
export const MessageType = {
  appendContentSize: 'appendContentSize',
  setContentOffset: 'setContentOffset',
};

export interface NestedScrollViewMessage {
  type: string;
  data: number | { x: number; y: number; animated?: boolean };
}
