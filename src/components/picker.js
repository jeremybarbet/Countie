import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, DatePickerIOS } from 'react-native';

import { fonts } from 'theme';

import Modal from './modal';
import Button from './button';

export default class Picker extends PureComponent {

  static propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
    onChange: PropTypes.func,
    date: PropTypes.object,
  }

  static defaultProps = {
    open: false,
    date: null,
  }

  render() {
    const { open, toggle, onChange, date } = this.props;

    return (
      <Modal isOpen={open} onPress={toggle}>
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

    ...fonts.heavy,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },

  picker__component: {
    backgroundColor: '#fff',
  },
});
