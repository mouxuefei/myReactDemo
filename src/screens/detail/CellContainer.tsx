import React from 'react';
import { Text, View } from 'react-native';
let containerCount = 0;
export class CellContainer extends React.Component {
  _containerId;
  constructor(args) {
    super(args);
    this._containerId = containerCount++;
  }

  render() {
    return (
      <View {...this.props}>
        {this.props.children}
        <Text>Cell Id: {this._containerId}</Text>
      </View>
    );
  }
}
