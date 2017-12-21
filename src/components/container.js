import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, StatusBar, Dimensions, SafeAreaView } from 'react-native';

import { isIphoneX } from 'utils/utils';
import { borderRadius } from 'theme';

const { height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = 20;
const STATUSBAR_HEIGHT_IPHONE_X = 44;

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
      <SafeAreaView style={s.host}>
        <StatusBar barStyle="light-content" />

        <View style={[s.host__content, this.background]}>
          {children}
        </View>
      </SafeAreaView>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,

    backgroundColor: '#000',
  },

  host__content: {
    marginTop: 0,

    height: isIphoneX() ? height - STATUSBAR_HEIGHT_IPHONE_X : height - STATUSBAR_HEIGHT,

    ...borderRadius,
    overflow: 'hidden',
  },
});
