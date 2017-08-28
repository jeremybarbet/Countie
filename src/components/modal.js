/* eslint-disable react-native/split-platform-components */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Easing } from 'react-native';
import ModalBox from 'react-native-modalbox';

export default class Modal extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
  }

  render() {
    const { children, isOpen } = this.props;

    return (
      <ModalBox
        animationDuration={300}
        easing={Easing.ease}
        isOpen={isOpen}
        style={s.modal}
        position="bottom"
        swipeToClose={false}
        backdropOpacity={0.9}
        backdropColor="#fff"
        coverScreen
      >
        <View style={s.modal__content}>
          {children}
        </View>
      </ModalBox>
    );
  }
}

const s = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',

    backgroundColor: 'transparent',
  },

  modal__content: {
    backgroundColor: '#6ef09f',

    shadowColor: '#000',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 14,

    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
