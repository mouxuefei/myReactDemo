/*
 * @Author: weiwenshe
 * @Date: 2018-08-09 19:11:24
 * @Last Modified by: jaybo
 * @Last Modified time: 2019-07-23 16:59:46
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BTouchable } from './BTouchable';

export type YTDefaultTabBarStyle =
  | 'normal'
  | 'studyPlan'
  | 'custom'
  | 'bookDetail'
  | 'personInfoDetail';

export interface YDCustomTabBarStyle {
  tabBarUnderLine: StyleProp<ViewStyle>;
  textActiveTitle: StyleProp<TextStyle>;
  textTitle: StyleProp<TextStyle>;
  tabs: StyleProp<ViewStyle>;
}

type Props = {
  goToPage: (index: number) => void;
  tabs: string[];
  scrollValue: Animated.Value;
  tabBarStyle: YTDefaultTabBarStyle;
  customTabbarStyle?: YDCustomTabBarStyle;
};

type State = {
  activeTab: number;
  containerWidth: number;
};

const defaultTabBarHeight = 50;
const studyPlanTabBarHeight = 38;

export default class YTDefaultTabBar extends Component<Props, State> {
  static defaultProps = {
    tabBarStyle: 'normal',
  };

  _styles = styles;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab: 0,
      containerWidth: Math.min(
        Dimensions.get('window').width,
        Dimensions.get('window').height
      ),
    };
  }

  _choosStyle = () => {
    const { tabBarStyle, customTabbarStyle } = this.props;
    if (tabBarStyle == 'studyPlan') {
      this._styles = studyPlanStyles;
    } else if (tabBarStyle === 'custom') {
      this._styles = customTabbarStyle;
    } else if (tabBarStyle === 'bookDetail') {
      this._styles = bookDetailStyles;
    } else if (tabBarStyle === 'personInfoDetail') {
      this._styles = personInfoDetailStyle;
    } else {
      this._styles = styles;
    }
  };

  setTabActive = (index: number) => {
    this.setState({
      activeTab: index,
    });
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextProps === this.props && nextState === this.state) {
      return false;
    }
    return true;
  }

  render() {
    // TODO: jaybo - iPad横竖屏开启后会出问题
    this._choosStyle();

    const { tabs, scrollValue, goToPage, tabBarStyle } = this.props;
    const { activeTab, containerWidth } = this.state;

    const numberOfTabs = tabs.length;

    let translateX;
    let underLineStyle;
    if (tabBarStyle === 'studyPlan') {
      translateX = scrollValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, containerWidth / numberOfTabs],
      });
      underLineStyle = {};
    } else if (tabBarStyle === 'bookDetail') {
      if (this.tabWidth) {
        translateX = scrollValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, this.tabWidth],
        });
      }

      underLineStyle = {
        width: 20,
      };
    } else if (tabBarStyle === 'personInfoDetail') {
      if (this.tabWidth) {
        translateX = scrollValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, this.tabWidth],
        });
      }
      const tabWidth = 101;
      const itemSpace = 24;
      const marginRight = 6;
      underLineStyle = {
        width: 24,
        marginLeft: (tabWidth - itemSpace + marginRight) / 2,
      };
    } else {
      translateX = scrollValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, containerWidth / numberOfTabs],
      });
      underLineStyle = {
        left: `${
          ((containerWidth / numberOfTabs - 0.07 * containerWidth) /
            (2 * containerWidth)) *
          100
        }%`,
      };
    }

    let underLineView = null;
    if (tabBarStyle === 'bookDetail') {
      underLineView = this._renderBookDetailUnderLiner();
    } else if (tabBarStyle === 'personInfoDetail') {
      underLineView = this.renderPersonInfoUnderLine();
    }
    return (
      <View style={this._styles.tabs} onLayout={this._onlayout}>
        {tabs.map((name, page) => {
          const isTabActive = activeTab === page;
          if (tabBarStyle === 'personInfoDetail') {
            return this.renderPersonalTab(name, page, isTabActive, goToPage);
          } else {
            return this.renderTab(name, page, isTabActive, goToPage);
          }
        })}
        <Animated.View
          style={[
            this._styles.tabBarUnderLine,
            translateX ? { transform: [{ translateX }] } : null,
            underLineStyle,
          ]}
        >
          {underLineView}
        </Animated.View>
      </View>
    );
  }

  _renderBookDetailUnderLiner = () => {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#3DA6FF', '#4E76FF']}
        style={{ width: 16, height: 4, borderRadius: 2 }}
      />
    );
  };

  renderPersonInfoUnderLine = () => {
    return <View style={this._styles?.underLine} />;
  };

  _onlayout = e => {
    const { width } = e.nativeEvent.layout;
    this.setState({
      containerWidth: width,
    });
  };

  renderTab = (
    name: string,
    page: number,
    isTabActive: boolean,
    onPressHandler: (number: number) => {}
  ) => {
    const activeStyle = isTabActive
      ? this._styles.textActiveTitle
      : this._styles.textTitle;
    return (
      <BTouchable
        testID={'1625890122'}
        style={this._styles.touchableTab}
        key={name + page}
        onPress={() => {
          this.setTabActive(page);
          onPressHandler(page);
        }}
        onLayout={e => {
          if (isTabActive) {
            this.onLayoutTab(e, page);
          }
        }}
      >
        <View style={this._styles.tab}>
          <Text style={activeStyle}>{name}</Text>
        </View>
      </BTouchable>
    );
  };

  private renderPersonalTab = (
    name: string,
    page: number,
    isTabActive: boolean,
    onPressHandler: (number: number) => void
  ) => {
    const activeStyle = isTabActive
      ? this._styles.textActiveTitle
      : this._styles.textTitle;
    const activeSubStyle = isTabActive
      ? this._styles?.textActiveSubTitle
      : this._styles?.textSubTitle;
    const aar = name?.split(':');
    return (
      <BTouchable
        testID={'1625890122'}
        style={this._styles.touchableTab}
        key={name + page}
        onPress={() => {
          this.setTabActive(page);
          onPressHandler(page);
        }}
        onLayout={e => {
          if (isTabActive) {
            this.onLayoutTab(e, page);
          }
        }}
      >
        <View style={this._styles.tab}>
          <View style={this._styles?.tabTitleSubContainer}>
            <Text style={activeStyle}>{aar[0]}</Text>
            <Text style={activeSubStyle}>({aar[1]})</Text>
          </View>
        </View>
      </BTouchable>
    );
  };

  tabWidth = 0;

  onLayoutTab = (e: any, page: number) => {
    const { width } = e.nativeEvent.layout;
    this.tabWidth = width;

    // this.setState({
    //   containerWidth: width,
    // });
  };

  static tabBarHeight(tabBarStyle: YTDefaultTabBarStyle): number {
    switch (tabBarStyle) {
      case 'studyPlan': {
        return studyPlanTabBarHeight;
      }
      case 'personInfoDetail': {
        return defaultTabBarHeight + 40;
      }
      default: {
        return defaultTabBarHeight;
      }
    }
  }
}

const styles = StyleSheet.create({
  tabs: {
    minHeight: defaultTabBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#EAEAEA',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarUnderLine: {
    bottom: 0,
    position: 'absolute',
    paddingBottom: 0,
    backgroundColor: 'blue',
    height: 3,
    left: '3.5%',
    width: '7%',
    borderRadius: 3,
  },
  touchableTab: { flex: 1 },
  textActiveTitle: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textTitle: { color: '#666666', fontSize: 13 },
});

const studyPlanStyles = StyleSheet.create({
  tabs: {
    minHeight: studyPlanTabBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2049A1',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarUnderLine: {
    bottom: 0,
    position: 'absolute',
    paddingBottom: 0,
    backgroundColor: '#00E7FF',
    height: 4,
    width: '33%',
  },
  touchableTab: { flex: 1 },
  textActiveTitle: {
    color: '#00E7FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textTitle: { color: '#83EAFF', fontSize: 14 },
});

const bookDetailStyles = StyleSheet.create({
  tabs: {
    minHeight: defaultTabBarHeight,
    flexDirection: 'row',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#EAEAEA',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: defaultTabBarHeight,
    minWidth: 60,
  },
  tabBarUnderLine: {
    bottom: 0,
    position: 'absolute',
    paddingBottom: 0,
    height: 3,
    borderRadius: 3,
  },
  touchableTab: {
    height: defaultTabBarHeight,
  },
  textActiveTitle: {
    color: '#151B37',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textTitle: {
    color: 'rgba(21, 27, 55, 0.45)',
    fontSize: 14,
    marginTop: 2,
    fontWeight: 'bold',
  },
});

const personInfoDetailStyle = StyleSheet.create({
  tabs: {
    minHeight: defaultTabBarHeight,
    flexDirection: 'row',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#EAEAEA',
    borderBottomColor: '#EDEDED',
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    height: defaultTabBarHeight,
    minWidth: 101,
    paddingLeft: 16,
    paddingRight: 4,
  },
  tabBarUnderLine: {
    bottom: 0,
    position: 'absolute',
    paddingBottom: 0,
    height: 3,
    borderRadius: 3,
  },
  touchableTab: {
    height: defaultTabBarHeight,
  },
  textActiveTitle: {
    color: '#151B37',
    fontWeight: 'bold',
    fontSize: 20,
  },
  textActiveSubTitle: {
    color: '#151B37',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
    marginLeft: 6,
  },
  textTitle: {
    color: 'rgba(21, 27, 55, 0.45)',
    fontSize: 14,
    marginTop: 2,
    fontWeight: 'normal',
  },
  textSubTitle: {
    color: 'rgba(21, 27, 55, 0.45)',
    fontWeight: 'normal',
    fontSize: 14,
    marginLeft: 6,
  },
  tabTitleSubContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  underLine: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#42E1EB',
  },
});
