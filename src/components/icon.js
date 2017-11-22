import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class icon extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.node,
    onPress: PropTypes.func,
  }

  hitIcon = {
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  }

  render() {
    const { children, style, onPress } = this.props;

    return (
      <TouchableOpacity
        hitSlop={this.hitIcon}
        style={[s.icon, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

const s = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 25,
    zIndex: 10,

    justifyContent: 'center',
    alignItems: 'center',

    width: 42,
    height: 42,

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 42,
  },
});
