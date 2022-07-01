import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { listFooterComponent } from '../../components/util';
interface Props {
  insertExtraCells?: any;
  onScrollView: any;
  scrollRef: any;
}
export class TestView extends PureComponent<Props> {
  scrollRef;
  scrollRef2;
  public onScroll = this.props.onScrollView;

  // 这是使用YTNestedScrollView这个组件需要的特定写法，当组件有header的时候需要加载这样一段；
  _renderInsertExtraCells = (): any => {
    let inserviews = [];
    if (this.props.insertExtraCells && this.props.insertExtraCells.length > 0) {
      inserviews = this.props.insertExtraCells.map((view, index) => (
        <View key={`fake${index}`}>{view}</View>
      ));
    }
    return inserviews;
  };

  _renderSeparator = () => {
    return <View style={{ height: 8, backgroundColor: '#F5F6FB' }} />;
  };

  getScrollRef = () => {
    return this.scrollRef;
  };

  getScroll2Ref = () => {
    console.log('aaaaaaaaaaaaaaaaa');

    return this.scrollRef2;
  };

  render() {
    const { scrollRef } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ScrollView
          {...this.props}
          style={{ width: 200 }}
          scrollEventThrottle={50}
          ref={ref => (this.scrollRef = ref)}
        >
          {this._renderInsertExtraCells()}
          {[1, 2, 2, 2, 2, 2, , 2].map(item => {
            return (
              <View
                style={{
                  width: 200,
                  height: 100,
                  backgroundColor: 'red',
                  marginBottom: 20,
                }}
              ></View>
            );
          })}
          {this.listFooter()}
        </ScrollView>
        <ScrollView
          {...this.props}
          style={{ width: 200 }}
          scrollEventThrottle={50}
        >
          {this._renderInsertExtraCells()}
          {[1, 2, 2, 2, 2, 2, , 2].map(item => {
            return (
              <View
                style={{
                  width: 200,
                  height: 100,
                  backgroundColor: 'red',
                  marginBottom: 20,
                }}
              ></View>
            );
          })}
          {this.listFooter()}
        </ScrollView>
      </View>
    );
  }

  private listFooter = () => {
    return listFooterComponent(this);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
