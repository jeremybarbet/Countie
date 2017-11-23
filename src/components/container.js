import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = 20;

export default class Welcome extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    background: PropTypes.string,
  }

  static defaultProps = {
    background: '#FFFFFF',
  }

  get background() {
    return {
      backgroundColor: this.props.background,
    };
  }

  render() {
    const { children } = this.props;

    return (
      <View style={s.host}>
        <StatusBar barStyle="light-content" />

        <View style={[s.host__content, this.background]}>
          {children}
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,

    backgroundColor: '#000',
  },

  host__content: {
    marginTop: STATUSBAR_HEIGHT,

    height: height - STATUSBAR_HEIGHT,

    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
});
