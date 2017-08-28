/* eslint-disable react-native/split-platform-components */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Easing } from 'react-native';
import Modal from 'react-native-modalbox';

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
      <Modal
        animationDuration={300}
        easing={Easing.ease}
        isOpen={open}
        style={s.input__modal}
        position="bottom"
        swipeToClose={false}
        backdropOpacity={0.9}
        backdropColor="#fff"
        coverScreen
      >
        <View style={s.input}>
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
        </View>
      </Modal>
    );
  }
}

const s = StyleSheet.create({
  input: {
    backgroundColor: '#6ef09f',

    shadowColor: '#000',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 14,
  },

  input__modal: {
    justifyContent: 'flex-end',

    backgroundColor: 'transparent',
  },

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
