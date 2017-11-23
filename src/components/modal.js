import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Easing, ViewPropTypes } from 'react-native';
import Modal from 'react-native-modal';

export default class ModalContainer extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    isOpen: PropTypes.bool,
    style: ViewPropTypes.style,
    onPress: PropTypes.func,
  }

  render() {
    const { children, isOpen, style, onPress } = this.props;

    return (
      <Modal
        isVisible={isOpen}
        style={[s.modal, style]}
        backdropOpacity={0.9}
        backdropColor="#fff"
        onBackdropPress={onPress}
        avoidKeyboard
      >
        <View style={s.modal__content}>
          {children}
        </View>
      </Modal>
    );
  }
}

const s = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',

    margin: 0,
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
