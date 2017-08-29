/* eslint-disable react-native/split-platform-components */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import Modal from './modal';
import Button from './button';

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
        <Button onPress={toggle}>Validate</Button>

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
  input__component: {
    paddingHorizontal: 30,

    height: 80,

    fontFamily: 'Avenir-Medium',
    fontSize: 18,
    color: '#333333',

    backgroundColor: '#fff',
  },
});
