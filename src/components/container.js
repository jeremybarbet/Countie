import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = 20;

export default class Welcome extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children } = this.props;

    return (
      <View style={s.host}>
        <StatusBar barStyle="light-content" />

        <View style={s.host__content}>
          {children}
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,

    backgroundColor: '#1a1a1a',
  },

  host__content: {
    marginTop: STATUSBAR_HEIGHT,

    height: height - STATUSBAR_HEIGHT,

    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
