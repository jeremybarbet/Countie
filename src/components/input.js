/* eslint-disable react-native/split-platform-components */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import Modal from './modal';

export default class Input extends PureComponent {

  static propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
  }

  static defaultProps = {
    open: false,
    toggle: () => {},
  }

  render() {
    const { open, toggle, onChange, text, placeholder } = this.props;

    return (
      <Modal isOpen={open}>
        <TouchableOpacity onPress={toggle}>
          <Text style={s.input__text}>{'Validate'.toUpperCase()}</Text>
        </TouchableOpacity>

        <TextInput
          style={s.input__component}
          onChangeText={onChange}
          value={text}
          placeholder={placeholder}
          placeholderTextColor="#c1ccdb"
        />
      </Modal>
    );
  }
}

const s = StyleSheet.create({
  input__text: {
    paddingVertical: 15,

    fontFamily: 'Avenir-Heavy',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },

  input__component: {
    paddingHorizontal: 30,

    height: 80,

    fontFamily: 'Avenir-Medium',
    fontSize: 18,
    color: '#333333',

    backgroundColor: '#fff',
  },
});
