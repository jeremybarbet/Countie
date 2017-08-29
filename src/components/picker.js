/* eslint-disable react-native/split-platform-components */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, DatePickerIOS, TouchableOpacity } from 'react-native';

import Modal from './modal';
import Button from './button';

export default class Picker extends PureComponent {

  static propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    date: PropTypes.string.isRequired,
  }

  static defaultProps = {
    open: false,
    toggle: () => {},
  }

  render() {
    const { open, toggle, onChange, date } = this.props;

    return (
      <Modal isOpen={open}>
        <Button onPress={toggle}>Validate</Button>

        <DatePickerIOS
          style={s.picker__component}
          date={date}
          mode="date"
          onDateChange={onChange}
        />
      </Modal>
    );
  }
}

const s = StyleSheet.create({
  picker__text: {
    paddingVertical: 15,

    fontFamily: 'Avenir-Heavy',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },

  picker__component: {
    backgroundColor: '#fff',
  },
});
