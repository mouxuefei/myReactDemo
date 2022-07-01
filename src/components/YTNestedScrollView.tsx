/* eslint-disable react/jsx-props-no-spreading */
import React, { Component, ReactElement } from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  PanResponderInstance,
  SafeAreaView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import ScrollableTabView, {
  ChangeTabProperties,
} from 'react-native-scrollable-tab-view';
import type {
  YDCustomTabBarStyle,
  YTDefaultTabBarStyle,
} from './YTDefaultTabBar';
import YTDefaultTabBar from './YTDefaultTabBar';
import {
  debounceWithFlag,
  EnhancedReactInstance,
  MessageType,
  onMessage,
  throttle,
} from './YTNestedScrollViewUtil';

/**
 * 包裹在这里个组件里的列表需要实现的
 * 1. 需要提供 titleLabel 标题
 * 2. 如果需要在 segment 下面插入的 cell, 提供renderUnderSegment: () => any 方法
 * 3. 每个组件里需要提供 getScrollRef: () => any, 需要返回真正能够滚动的组件
 */

/**
 * 这个组件传递给每个列表的方法
 * 1.  headerHeight
 * 2. insertExtraCells, 插入上方的组件, 作用和 headerHeight 一样, 都是为了回调高度
 * 3. 被重写的方法: onScroll, onContentSizeChange, onLayout, ref
 */

/** ************************* */
type ContentViewType = {
  ref?: ScrollViewProps & EnhancedReactInstance;
  contentSizeH: number;
  viewHeight: number;
  currentOffsetY: number;
  appendSize: number;
  lastAppendSizeTimeStamp: number;
  contentSizeInitial: boolean;
  lastSyncFlatOffsetTime: number;
};
type FakeViewType = {
  fakeViewY: number;
  animateY: Animated.Value;
  insertHeaderHeight: number;
  hadLayout: boolean;
};

interface DefaultTabRef {
  setTabActive: (index: number) => void;
}

type DefaultTabType = {
  ref?: DefaultTabRef;
  scrollAnimateValue: Animated.Value;
  tabs: string[];
};
type ScrollTabViewType = {
  ref?: ScrollableTabView;
  value: number;
};
type VIEWS = {
  fakeView: FakeViewType;
  defaultTabbar: DefaultTabType;
  scrollableTabView: ScrollTabViewType;
  scrollableTabViewContents: ContentViewType[];
};

type Props = {
  children: ReactElement[];
  insertHeaderHeight?: number;
  renderHeader?: () => JSX.Element;
  onChangeTab?: (index: number) => void;
  tabBarStyle: YTDefaultTabBarStyle;
  customTabBarStyle?: YDCustomTabBarStyle; // 自定义 tabbar 样式
  renderTabBar?: () => JSX.Element;
  renderTabBarTopView?: () => JSX.Element;
  useSafeArea?: boolean;
  maxTabWidth?: number;
  tabBarContentStyle?: StyleProp<ViewStyle>;
  disableIOSPopGesture?: boolean;
};

const DEBOUNCE_TIME = 300;

export class YTNestedScrollView extends Component<Props> {
  // 保存所有 view 的信息
  private views: VIEWS = {
    // 最上方显示的占位 view
    fakeView: {
      fakeViewY: 0,
      animateY: new Animated.Value(0),
      insertHeaderHeight: 0,
      hadLayout: false,
    },
    // 左右滑动的 segment
    defaultTabbar: {
      ref: undefined,
      scrollAnimateValue: new Animated.Value(0),
      tabs: [],
    },
    // 左右滑动容器
    scrollableTabView: {
      ref: undefined,
      value: 0, // 左右滑动的position
    },
    // 容器里的内容
    scrollableTabViewContents: [],
  };

  private pageControl = {
    fromPage: 0,
    currentPage: 0,
  };

  private nestedScrollViewHeight = Dimensions.get('window').height;

  // 处理头部手势滑动
  private panResponder?: PanResponderInstance;
  private panResponderStartContentOffset: { currentOffsetY: number }[] = [];
  private panAnimated = new Animated.Value(0);
  private decayAni: Animated.CompositeAnimation | null = null;
  private decaying = false;
  private lastDecayY = 0;
  private panMove = false;
  private panStart = false;
  private timers: NodeJS.Timeout[] = [];
  private lastChangeIndex = 0;

  static defaultProps = {
    tabBarStyle: 'normal',
    useSafeArea: true,
  };

  constructor(props: Props) {
    super(props);
    this.initialize(props);
    this.panAnimated.addListener(this.panListener);
  }

  getRef = (index: number) => {
    return this.views.scrollableTabViewContents[index].ref;
  };

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    // 只有 tab 个数改变或者两次list 不一样的时候才初始化, 现在只有在书籍详情页才有这种情况
    if (
      // eslint-disable-next-line react/destructuring-assignment
      nextProps.children.length !== this.props.children.length ||
      this.diffLists(nextProps)
    ) {
      this.initialize(nextProps);
    }
  };

  componentWillUnmount = () => {
    this.decayAni && this.decayAni.stop();
    this.panAnimated.removeAllListeners();
    this.removeAllTimer();
  };

  private diffLists = (nextProps: Props) => {
    const nextLists = nextProps.children
      .filter(child => !!child)
      .map(child => child.key || child.props.titlLable || '');
    const { children } = this.props;
    const nowLists = children
      .filter(child => !!child)
      .map(child => child.key || child.props.titlLable || '');
    return JSON.stringify(nowLists) !== JSON.stringify(nextLists);
  };

  // 根据props.children来初始化对象存储
  private initialize = (props: Props) => {
    const { insertHeaderHeight } = props;
    let { children } = props;
    children = children.filter(child => !!child);
    const scrollableTabViewContents = children.map((_child, index) => {
      const view = this.views.scrollableTabViewContents[index];
      return {
        ref: view?.ref || undefined,
        contentSizeH: Math.ceil(view?.contentSizeH || 0),
        viewHeight: Math.ceil(view?.viewHeight || 0),
        currentOffsetY: Math.ceil(view?.currentOffsetY || 0),
        appendSize: Math.ceil(view?.appendSize || 0),
        lastAppendSizeTimeStamp: view?.lastAppendSizeTimeStamp || 0,
        contentSizeInitial: false,
        lastSyncFlatOffsetTime: 0,
      };
    });
    const tabs = children.map(child => child.props.titlLable || '');
    this.views.fakeView.insertHeaderHeight = Math.ceil(
      this.views.fakeView.insertHeaderHeight || insertHeaderHeight || 0
    );
    this.views.scrollableTabViewContents = scrollableTabViewContents;
    this.views.defaultTabbar.tabs = tabs;
    this.panResponderStartContentOffset = children.map((_child, _index) => {
      return {
        currentOffsetY: 0,
      };
    });
    this.setupPanHandler();
  };

  private setupPanHandler = () => {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        this.panStart = true;
        this.panMove = false;
        const index = this.pageControl.currentPage;
        const view = this.views.scrollableTabViewContents[index];
        this.panResponderStartContentOffset[index].currentOffsetY =
          view.currentOffsetY;
        this.stopDecayAni();
        this.panAnimated.setValue(0);
        this.lastDecayY = 0;
        if (Math.abs(gestureState.dy) >= 5) {
          const sizeH =
            this.views.scrollableTabViewContents[this.pageControl.currentPage]
              .contentSizeH;
          if (sizeH > this.nestedScrollViewHeight) {
            return true;
          }
        }
        return false;
      },
      onPanResponderMove: (_evt, gestureState) => {
        this.panMove = true;
        this.panStart = false;
        const index = this.pageControl.currentPage;
        const offset =
          this.panResponderStartContentOffset[index].currentOffsetY -
          Math.ceil(gestureState.dy);
        this.panGestrueMove(index, offset);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        this.panMove = false;
        this.panStart = false;
        this.decayAni = Animated.decay(this.panAnimated, {
          velocity: gestureState.vy,
          useNativeDriver: true,
        });
        this.decayAni.start(this.stopDecayAni);
      },
    });
  };

  private stopDecayAni = () => {
    this.decayAni && this.decayAni.stop();
    this.decaying = false;
  };

  private panListener = (state: { value: number }) => {
    if (this.panStart) {
      // 在开始滑动滑动的时候 state.value 为 0, 不响应
      return;
    }
    const index = this.pageControl.currentPage;
    // const view = this._views.scrollableTabViewContents[index];
    const current = Math.ceil(state.value);

    let y = this.views.fakeView.fakeViewY;
    y += current - this.lastDecayY;
    let validY = this.views.fakeView.fakeViewY;
    if (y < -this.views.fakeView.insertHeaderHeight) {
      validY = -this.views.fakeView.insertHeaderHeight;
      this.stopDecayAni();
    } else if (y > 0) {
      // validY = validY;
      this.stopDecayAni();
    } else {
      validY = y;
    }
    this.lastDecayY = current;
    this.views.fakeView.fakeViewY = validY;
    this.views.fakeView.animateY.setValue(validY);
    this.decaying = true;
    this.panGestrueMove(index, -validY);
  };

  public panGestrueMove = (index: number, offset: number) => {
    this.sendMessage(index, MessageType.setContentOffset, {
      x: 0,
      y: offset,
    });
  };

  /** =====================处理ScrollableTabView滚动===================== */
  /** =====================处理ScrollableTabView滚动===================== */
  /** =====================处理ScrollableTabView滚动===================== */

  private handleScrollTabViewRef = (ref: ScrollableTabView) => {
    this.views.scrollableTabView.ref = ref;
  };

  // ScrollableTabView的 tabbar, 不显示
  private renderTabbar = () => <View />;

  // 左右滑动时调用, 比_handleChangeTab 先执行, 但是直接点击 tab 时, 这个方法会后执行
  private handleScrollTabViewScroll = (value: number) => {
    /**
     * 点击cell跳页的时候, 每个列表会自动调用 onscroll 方法记录当前位置!!!!!,导致header frame.y会变化,
     * 所以需要判断只有真正滚动的时候才更改头部frame
     */

    if (this.views.scrollableTabView.value === value) {
      this.views.scrollableTabView.value = value;
      this.views.defaultTabbar.scrollAnimateValue.setValue(value);
    } else {
      this.views.scrollableTabView.value = value;
      this.views.defaultTabbar.scrollAnimateValue.setValue(value);
      if (value > this.pageControl.currentPage) {
        this.throttleSyncFlatOffset(this.pageControl.currentPage + 1);
      } else if (value < this.pageControl.currentPage) {
        this.throttleSyncFlatOffset(this.pageControl.currentPage - 1);
      } else {
        this.throttleSyncFlatOffset(this.pageControl.currentPage);
      }
    }
  };

  // flatlist左右切换完成的时候调用
  private handleChangeTab = (value: ChangeTabProperties) => {
    this.pageControl.fromPage = value.from;
    this.pageControl.currentPage = value.i;
    this.views.scrollableTabView.value = this.pageControl.currentPage;
    if (this.views.defaultTabbar.ref) {
      this.views.defaultTabbar.ref.setTabActive(this.pageControl.currentPage);
    }
    this.throttleSyncFlatOffset(this.pageControl.currentPage);
    const { onChangeTab } = this.props;
    if (onChangeTab) {
      onChangeTab(value.i);
    }
  };

  /** =====================处理每个列表滚动===================== */
  /** =====================处理每个列表滚动===================== */
  /** =====================处理每个列表滚动===================== */

  private handleFlatListRef = (ref: any, index: number) => {
    const view = this.views.scrollableTabViewContents[index];
    if (view) {
      if (!!ref && typeof ref.getWrappedInstance === 'function') {
        const realRef = ref.getWrappedInstance();
        view.ref = realRef;
      } else {
        view.ref = ref;
      }
    }
    // 只同步当前的 index, 否则其他 tab 的会去同步 header, 导致 frame.y 错误
    if (this.pageControl.currentPage === index) {
      view.lastSyncFlatOffsetTime = Date.now();
      this.syncFlatOffsetAfterInit(index);
    }
  };

  private syncFlatOffsetAfterInit = (index: number) => {
    const view = this.views.scrollableTabViewContents[index];
    if (view.contentSizeInitial === true) {
      this.syncFlatOffset(index, true);
      view.contentSizeInitial = false;
    } else {
      setTimeout(() => {
        if (Date.now() - view.lastSyncFlatOffsetTime <= 500) {
          this.syncFlatOffsetAfterInit(index);
        } else {
          view.contentSizeInitial = true;
        }
      }, 16);
    }
  };

  private handleListViewContentSizeChange = (
    contentSizeH: number,
    index: number,
    scroll = true
  ) => {
    const view = this.views.scrollableTabViewContents[index];
    const { viewHeight } = view;
    if (!scroll) {
      // 进行防抖, 在 DEBOUNDS_TIME 内过滤掉多次 index 相同的时候重复appendSize,
      // 如果在两次添加 contentSize的 index 不相同, 不能再这里进行过滤, 需要在_appendContentSizeIfNeed中过滤掉
      this.debounceAppendContentSizeIfNeed(viewHeight, contentSizeH, index, {
        deboundsFlag: index === this.lastChangeIndex,
      });
      this.lastChangeIndex = index;
      view.contentSizeInitial = true;
    } else {
      this.appendContentSizeIfNeed(viewHeight, contentSizeH, index, scroll);
    }

    view.contentSizeH = Math.ceil(contentSizeH);
  };

  private handleListViewLayout = (viewHeight: number, index: number) => {
    this.views.scrollableTabViewContents[index].viewHeight =
      Math.ceil(viewHeight);
  };

  // 在 contentsize 改变的时候, 根据情况添加底部的 contentSize
  private appendContentSizeIfNeed = (
    nextViewHeightFloat: number,
    nextContentSizeHeightFloat: number,
    index: number,
    scroll = false
  ) => {
    if (scroll === false) {
      const view = this.views.scrollableTabViewContents[index];
      if (Date.now() - view.lastAppendSizeTimeStamp < DEBOUNCE_TIME) {
        // 在 DEBOUNDS_TIME 时间内, 不进行多次 appendSize 操作
        return;
      } else {
        view.lastAppendSizeTimeStamp = Date.now();
      }
    }
    const nextViewHeight = Math.ceil(nextViewHeightFloat);
    const nextContentSizeHeight = Math.ceil(nextContentSizeHeightFloat);
    if (nextContentSizeHeight !== 0) {
      const headerHeight = Math.ceil(this.views.fakeView.insertHeaderHeight);
      const viewHeight =
        nextViewHeight !== 0
          ? nextViewHeight
          : Math.ceil(this.nestedScrollViewHeight);
      const minScrollContentSizeHeight = viewHeight + headerHeight;
      const currentAppendSize =
        this.views.scrollableTabViewContents[index].appendSize;

      // 当列表contentSize 比最小的长的时候, 此时需要额外添加的高度
      const minusAppendSize = Math.max(
        minScrollContentSizeHeight -
          (nextContentSizeHeight - currentAppendSize),
        0
      );
      if (nextContentSizeHeight - minScrollContentSizeHeight < 0) {
        const appendSize =
          minScrollContentSizeHeight -
          nextContentSizeHeight +
          currentAppendSize;
        this.appendContentSize(index, appendSize);
      } else if (
        nextContentSizeHeight - minScrollContentSizeHeight > 0 &&
        currentAppendSize !== minusAppendSize
      ) {
        // 需要先减去当前已经增加的 contentSize
        const appendSize = minusAppendSize;
        this.appendContentSize(index, appendSize);
      }
    }
  };

  private appendContentSize = (index: number, appendSize: number) => {
    const list = this.views.scrollableTabViewContents[index];
    const sendSuccess = this.sendMessage(
      index,
      MessageType.appendContentSize,
      appendSize
    );
    if (sendSuccess) {
      list.appendSize = Math.ceil(appendSize);
    }
  };

  private sendMessage = (
    index: number,
    type: string,
    data: number | { x: number; y: number }
  ) => {
    const list = this.views.scrollableTabViewContents[index].ref;
    const { timer, success } = onMessage(
      list,
      { type, data },
      this.removeTimer
    );
    if (timer) {
      this.timers.push(timer);
    }
    return success;
  };

  private removeTimer = (timer: NodeJS.Timeout) => {
    const needDeleteTimers = this.timers.filter(t => t === timer);
    const newTimers = this.timers.filter(t => t !== timer);
    needDeleteTimers.forEach((timerForClear: NodeJS.Timeout) =>
      clearTimeout(timerForClear)
    );
    this.timers = newTimers;
  };

  private removeAllTimer = () => {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
  };

  // 处理列表纵向滑动
  private handleListScroll = (e: any, index: number) => {
    this.handleListViewContentSizeChange(
      e.nativeEvent.contentSize.height,
      index
    );
    this.handleListViewLayout(e.nativeEvent.layoutMeasurement.height, index);
    const offsetY = Math.ceil(e.nativeEvent.contentOffset.y);
    if (
      this.views.scrollableTabViewContents[index].currentOffsetY !== offsetY
    ) {
      /**
       * 点击cell跳页的时候, 每个列表会自动调用 onscroll 方法记录当前位置!!!!!,导致header frame.y会变化,
       * 所以需要判断只有真正滚动的时候才更改头部frame
       * 减速的时候就那边自己更新头部, 用手滑动的时候需要能跟随
       */

      const panMove = this.panMove || !this.decaying;
      if (this.pageControl.currentPage === index && panMove) {
        this.updateHeaderFrame(offsetY);
      }
    }
    this.views.scrollableTabViewContents[index].currentOffsetY = offsetY;
  };

  // 左右滑动时同步各个 flatlist 的 offset
  private syncFlatOffset = (needSyncIndex: number, fromRef = false) => {
    const needSyncView = this.views.scrollableTabViewContents[needSyncIndex];
    if (!needSyncView) {
      return;
    }
    const needSyncViewRef = needSyncView.ref;
    // const needSyncViewCurrentOffsetY = needSyncView.currentOffsetY;
    const needSyncViewContentSizeH = needSyncView.contentSizeH;
    const needSyncViewHeight = needSyncView.viewHeight;
    // const offsetNotEqualFakeviewY =
    //   needSyncViewCurrentOffsetY !== -this._views.fakeView.fakeViewY;
    // const fakeViewNotShow =
    //   needSyncViewCurrentOffsetY > this._views.fakeView.insertHeaderHeight &&
    //   -this._views.fakeView.fakeViewY >=
    //     this._views.fakeView.insertHeaderHeight;
    const needSync = needSyncViewRef; // && !fakeViewNotShow;
    if (needSync || fromRef) {
      // 学习计划学习 tab 每次viewWillAppear的时候列表重新渲染, 有时候列表会自动回到 offsetY=0的时候, 但是没有触发 onscroll 回调,
      // 导致记录中 offsetY 还是之前的值, 但是列表的位置却不是 offset 的位置
      let couldScrollH = needSyncViewContentSizeH - needSyncViewHeight;
      couldScrollH = couldScrollH > 0 ? couldScrollH : 0;
      const scrollY = Math.min(couldScrollH, -this.views.fakeView.fakeViewY);
      this.sendMessage(needSyncIndex, MessageType.setContentOffset, {
        x: 0,
        y: scrollY,
      });
      this.updateHeaderFrame(scrollY);
    }
  };

  // 防抖和节流方法一定要放在他所节流的函数的定义下面, 否则报错
  // eslint-disable-next-line react/sort-comp
  private throttleSyncFlatOffset = throttle(
    this.syncFlatOffset,
    DEBOUNCE_TIME / 3,
    true
  );

  // private throttleAppendContentSizeIfNeed = throttle(
  //   this.appendContentSizeIfNeed,
  //   DEBOUNCE_TIME,
  //   true
  // );

  private debounceAppendContentSizeIfNeed = debounceWithFlag(
    this.appendContentSizeIfNeed,
    DEBOUNCE_TIME,
    true
  );

  /** =====================处理 header 部分===================== */
  /** =====================处理 header 部分===================== */
  /** =====================处理 header 部分===================== */

  private renderInsertHeader = (needShow: boolean = false) => {
    if (needShow) {
      return this.renderHeader();
    } else {
      return (
        <View
          style={{
            height: this.views.fakeView.insertHeaderHeight,
          }}
        />
      );
    }
  };

  // segment 上方的真正的 header
  private renderHeader = () => {
    const { renderHeader } = this.props;
    const heightStyle: StyleProp<ViewStyle> = { height: 1 };
    return (
      <View onLayout={this.handleHeaderLayout}>
        {renderHeader ? renderHeader() : <View style={heightStyle} />}
      </View>
    );
  };

  private handleHeaderLayout = (e: LayoutChangeEvent) => {
    const height = Math.ceil(e.nativeEvent.layout.height);
    if (this.views.fakeView.insertHeaderHeight !== height) {
      this.views.fakeView.hadLayout = true;
      this.views.fakeView.insertHeaderHeight = height;
      this.forceUpdate();
    }
  };

  private handleDefaultTabbarRef = (ref: YTDefaultTabBar) => {
    this.views.defaultTabbar.ref = ref;
  };

  private renderDefaultTabbar = () => {
    const { renderTabBar } = this.props;
    if (renderTabBar) {
      return renderTabBar();
    } else {
      const {
        tabBarStyle,
        customTabBarStyle: customTabbarStyle,
        maxTabWidth,
        renderTabBarTopView,
        tabBarContentStyle,
      } = this.props;

      const tabBarContainerStyle =
        maxTabWidth != null ? { ...styles.tabView, maxWidth: maxTabWidth } : {};
      return (
        <View
          style={[
            tabBarContainerStyle,
            tabBarContentStyle ? { ...tabBarContentStyle } : {},
          ]}
        >
          {renderTabBarTopView?.()}
          <YTDefaultTabBar
            ref={this.handleDefaultTabbarRef}
            goToPage={this.gotoPage}
            tabs={this.views.defaultTabbar.tabs}
            scrollValue={this.views.defaultTabbar.scrollAnimateValue}
            tabBarStyle={tabBarStyle}
            customTabbarStyle={customTabbarStyle}
          />
        </View>
      );
    }
  };

  private renderHeaderSegment = (needShow: boolean = false) => {
    if (needShow) {
      return this.renderDefaultTabbar();
    } else {
      const { tabBarStyle } = this.props;
      const tabBarHeight = YTDefaultTabBar.tabBarHeight(tabBarStyle);
      const style: StyleProp<ViewStyle> = {
        height: tabBarHeight,
        width: '100%',
      };
      return <View style={style} />;
    }
  };

  gotoPage = (index: number) => {
    this.throttleSyncFlatOffset(index);
    if (this.views.scrollableTabView) {
      this.views.scrollableTabView.ref?.goToPage?.(index);
    }
  };

  private renderFakeHeader = () => {
    const style: Animated.AnimatedProps<StyleProp<ViewStyle>> = {
      flex: 1,
      width: '100%',
      position: 'absolute',
      transform: [
        {
          translateY: this.views.fakeView.animateY,
        },
      ],
    };
    return (
      <Animated.View style={style} {...this.panResponder?.panHandlers}>
        {this.renderInsertHeader(true)}
        {this.renderHeaderSegment(true)}
      </Animated.View>
    );
  };

  // 更新插入头部的view 的 frame
  public updateHeaderFrame = (offsetY: number) => {
    const validOffsetY = Math.ceil(
      Math.max(-offsetY, -this.views.fakeView.insertHeaderHeight)
    );
    this.views.fakeView.animateY.setValue(validOffsetY);
    this.views.fakeView.fakeViewY = validOffsetY;
  };

  private onSafeAreaViewLayout = (e: LayoutChangeEvent) => {
    this.nestedScrollViewHeight = e.nativeEvent.layout.height;
  };

  render() {
    const { tabBarStyle, children, useSafeArea, disableIOSPopGesture } =
      this.props;
    const tabBarHeight = YTDefaultTabBar.tabBarHeight(tabBarStyle);
    const Container = useSafeArea ? SafeAreaView : View;
    return (
      <Container
        style={styles.safeContainer}
        onLayout={this.onSafeAreaViewLayout}
      >
        <ScrollableTabView
          ref={this.handleScrollTabViewRef}
          renderTabBar={this.renderTabbar}
          scrollWithoutAnimation={false}
          onScroll={this.handleScrollTabViewScroll}
          onChangeTab={this.handleChangeTab}
          prerenderingSiblingsNumber={Infinity}
          disableIOSPopGesture={disableIOSPopGesture}
        >
          {children
            .filter(child => !!child)
            .map((child, index) => {
              let insertCells = [
                this.renderInsertHeader(),
                this.renderHeaderSegment(),
              ];
              if (child.props.renderUnderSegment) {
                const underSegmentCell = child.props.renderUnderSegment
                  ? child.props.renderUnderSegment()
                  : [];
                insertCells = insertCells.concat(underSegmentCell);
              }
              return React.cloneElement(child, {
                headerHeight:
                  this.views.fakeView.insertHeaderHeight + tabBarHeight,
                insertExtraCells: insertCells,
                scrollEventThrottle: 1,
                onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                  const view = this.views.scrollableTabViewContents[index];
                  if (view?.ref && typeof view.ref.onScroll === 'function') {
                    view.ref.onScroll(e);
                  }
                  this.handleListScroll(e, index);
                },
                onContentSizeChange: (w: number, h: number) => {
                  const view = this.views.scrollableTabViewContents[index];
                  if (
                    view?.ref &&
                    typeof view.ref.onContentSizeChange === 'function'
                  ) {
                    view.ref.onContentSizeChange(w, h);
                  }
                  this.handleListViewContentSizeChange(h, index, false);
                },
                onLayout: (e: LayoutChangeEvent) => {
                  const view = this.views.scrollableTabViewContents[index];
                  if (view?.ref && typeof view.ref.onLayout === 'function') {
                    view.ref.onLayout(e);
                  }
                  this.handleListViewLayout(e.nativeEvent.layout.height, index);
                },
                ref: (ref: ReactElement) => this.handleFlatListRef(ref, index),
                // eslint-disable-next-line react/no-array-index-key
                key: index,
                onScrollBeginDrag: (
                  e: NativeSyntheticEvent<NativeScrollEvent>
                ) => {
                  const view = this.views.scrollableTabViewContents[index];
                  if (
                    view?.ref &&
                    typeof view.ref.onScrollBeginDrag === 'function'
                  ) {
                    view.ref.onScrollBeginDrag(e);
                  }
                  this.stopDecayAni();
                },
              });
            })}
        </ScrollableTabView>
        {this.renderFakeHeader()}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },

  tabView: {
    width: '100%',
    alignSelf: 'center',
  },
});
