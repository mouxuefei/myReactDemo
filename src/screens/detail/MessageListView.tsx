import React, { Component } from 'react';
import { requireNativeComponent, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { ViewProps } from 'react-native';

export interface Message {
  msgType: number;
  text: string;
  msgId: string;
}

interface Props extends ViewProps {
  initList: Message[];
  jsClick: (data: any) => void;
}
export class MessageListView extends Component<Props> {
  render() {
    return <MessageListNativeView {...this.props} />;
  }
}

const MessageListNativeView = requireNativeComponent('ReactMessageList');
