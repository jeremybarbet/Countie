import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, KeyboardAvoidingView, Dimensions } from 'react-native';

import { fonts } from 'theme';

import Modal from './modal';
import Button from './button';

const { width } = Dimensions.get('window');

export default class Input extends PureComponent {

  static propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
    onChange: PropTypes.func,
    text: PropTypes.string,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    open: false,
    text: null,
  }

  componentDidUpdate() {
    if (this.props.open) {
      this.input.focus();
    }
  }

  render() {
    const { open, toggle, onChange, text, placeholder } = this.props;

    return (
      <KeyboardAvoidingView behavior="position">
        <Modal isOpen={open} onPress={toggle} style={s.input__modal}>
          <Button onPress={toggle}>Validate</Button>

          <TextInput
            ref={(c) => { this.input = c; }}
            style={s.input__component}
            onChangeText={onChange}
            value={text}
            placeholder={placeholder}
            placeholderTextColor="#c1ccdb"
            autoCapitalize="none"
            underlineColorAndroid="transparent"
          />
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const s = StyleSheet.create({
  input__modal: {
    width,
    height: 230,
  },

  input__component: {
    paddingHorizontal: 30,

    height: 80,

    ...fonts.medium,
    fontSize: 18,
    color: '#333333',

    backgroundColor: '#fff',
  },
});
