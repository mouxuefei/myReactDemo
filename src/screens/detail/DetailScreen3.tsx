import React, { Component } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import { CellContainer } from './CellContainer';
import { MessageList } from './Message';

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

/***
 * To test out just copy this component and render in you root component
 */
export class DetailScreen3 extends React.Component {
  constructor(args) {
    super(args);

    let { width } = Dimensions.get('window');

    //Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
    //THIS IS VERY IMPORTANT, FORGET PERFORMANCE IF THIS IS MESSED UP
    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    this._layoutProvider = new LayoutProvider(
      index => {
        if (index % 3 === 0) {
          return ViewTypes.FULL;
        } else if (index % 3 === 1) {
          return ViewTypes.HALF_LEFT;
        } else {
          return ViewTypes.HALF_RIGHT;
        }
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.HALF_LEFT:
            dim.width = width / 2;
            dim.height = 160;
            break;
          case ViewTypes.HALF_RIGHT:
            dim.width = width / 2;
            dim.height = 160;
            break;
          case ViewTypes.FULL:
            dim.width = width;
            dim.height = 140;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);

    //Since component should always render once data has changed, make data provider part of the state
    this.state = {
      dataProvider: dataProvider.cloneWithRows(this._generateArray(300)),
    };
  }

  _generateArray(n) {
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = i;
    }
    return arr;
  }

  //Given type and data return the view component
  _rowRenderer(type, data) {
    //You can return any view here, CellContainer has no special significance
    switch (type) {
      case ViewTypes.HALF_LEFT:
        return (
          <CellContainer style={styles.containerGridLeft}>
            <Image
              style={{ height: 160, width: 60 }}
              source={{
                uri: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-15-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658470664&t=b4004ebb0853f2d4a862d264d069921d',
              }}
            ></Image>
          </CellContainer>
        );
      case ViewTypes.HALF_RIGHT:
        return (
          <CellContainer style={styles.containerGridRight}>
            <Text>Data: {data}</Text>
          </CellContainer>
        );
      case ViewTypes.FULL:
        return (
          <CellContainer style={styles.container}>
            <Text>Data: {data}</Text>
          </CellContainer>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <MessageList
        style={{ flex: 1 }}
        // onMsgClick={_onMessagePress}
        // onLinkClick={_onOpenURL}
        // onAvatarClick={_onAvatarPress}
        // onStatusViewClick={_onStatusViewClick}
        // onTouchMsgList={_onTouchMsgList}
        // onClickChangeAutoScroll={_onClickChangeAutoScroll}
        // onPullToRefresh={_loadMoreContentAsync}
        sendBubble={{ imageName: 'send_msg', padding: 10 }}
        receiveBubbleTextColor='#ffffff'
        sendBubbleTextSize={14}
        receiveBubbleTextSize={14}
        sendBubblePressedColor='#dddddd'
        eventMsgTxtColor='#ffffff'
        eventMsgTxtSize={12}
        initList={[
          { msgType: 'text', text: 'aaaa' },
          { msgType: 'text', text: 'aaaa' },
          { msgType: 'text', text: 'aaaa' },
        ]}
      />
    );
  }
}
const styles = {
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#00a1f1',
  },
  containerGridLeft: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ffbb00',
  },
  containerGridRight: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#7cbb00',
  },
};
