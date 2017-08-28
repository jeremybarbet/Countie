/* eslint-disable react-native/split-platform-components */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, DatePickerIOS, TouchableOpacity, Easing } from 'react-native';
import Modal from 'react-native-modalbox';

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
      <Modal
        animationDuration={300}
        easing={Easing.ease}
        isOpen={open}
        style={s.picker__modal}
        position="bottom"
        swipeToClose={false}
        backdropOpacity={0.9}
        backdropColor="#fff"
        coverScreen
      >
        <View style={s.picker}>
          <TouchableOpacity onPress={toggle}>
            <Text style={s.picker__text}>{'Validate'.toUpperCase()}</Text>
          </TouchableOpacity>

          <DatePickerIOS
            style={s.picker__component}
            date={date}
            mode="date"
            onDateChange={onChange}
            // minimumDate={date}
          />
        </View>
      </Modal>
    );
  }
}

const s = StyleSheet.create({
  picker: {
    backgroundColor: '#6ef09f',

    shadowColor: '#000',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 14,
  },

  picker__modal: {
    justifyContent: 'flex-end',

    backgroundColor: 'transparent',
  },

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
