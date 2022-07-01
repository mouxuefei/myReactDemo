import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { BTouchable } from './BTouchable';

export type DefaultTabBarStyle = 'normal' | 'studyPlan' | 'custom';

export interface CustomTabBarStyle {
  tabBarUnderLine: StyleProp<ViewStyle>;
  textActiveTitle: StyleProp<TextStyle>;
  textTitle: StyleProp<TextStyle>;
  tab: StyleProp<ViewStyle>;
  tabs: StyleProp<ViewStyle>;
  touchableTab: StyleProp<ViewStyle>;
}

type Props = {
  goToPage: (index: number) => void;
  tabs: string[];
  scrollValue: Animated.Value;
  tabBarStyle: DefaultTabBarStyle;
  customTabBarStyle?: CustomTabBarStyle;
};

type State = {
  activeTab: number;
  containerWidth: number;
};

const defaultTabBarHeight = 50;
const studyPlanTabBarHeight = 38;
class DefaultTabBar extends Component<Props, State> {
  static defaultProps = {
    tabBarStyle: 'normal',
  };

  private _styles: CustomTabBarStyle = styles;

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

  private chooseStyle = () => {
    const { tabBarStyle, customTabBarStyle } = this.props;
    if (tabBarStyle == 'studyPlan') {
      this._styles = studyPlanStyles;
    } else if (tabBarStyle === 'custom' && customTabBarStyle) {
      this._styles = customTabBarStyle;
    } else {
      this._styles = styles;
    }
  };

  public setTabActive = (index: number) => {
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
    this.chooseStyle();

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
    return (
      <View style={this._styles.tabs} onLayout={this.onLayout}>
        {tabs.map((name, page) => {
          const isTabActive = activeTab === page;
          return this.renderTab(name, page, isTabActive, goToPage);
        })}
        <Animated.View
          style={[
            this._styles.tabBarUnderLine,
            { transform: [{ translateX }] },
            underLineStyle,
          ]}
        ></Animated.View>
      </View>
    );
  }

  private onLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    this.setState({
      containerWidth: width,
    });
  };

  private renderTab = (
    name: string,
    page: number,
    isTabActive: boolean,
    onPressHandler: (index: number) => void
  ) => {
    const activeStyle = isTabActive
      ? this._styles.textActiveTitle
      : this._styles.textTitle;
    return (
      <BTouchable
        style={this._styles.touchableTab}
        key={name + page}
        onPress={() => {
          this.setTabActive(page);
          onPressHandler(page);
        }}
      >
        <View style={this._styles.tab}>
          <Text style={activeStyle}>{name}</Text>
        </View>
      </BTouchable>
    );
  };
  static tabBarHeight(tabBarStyle: DefaultTabBarStyle): number {
    switch (tabBarStyle) {
      case 'studyPlan': {
        return studyPlanTabBarHeight;
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
    backgroundColor: '#4E76FF',
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

export { DefaultTabBar };
