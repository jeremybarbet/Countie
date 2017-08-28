/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import moment from 'moment';

import Container from '../components/container';
import Picker from '../components/picker';
import Input from '../components/input';

const PLACEHOLDER = 'my next travel';

export default class Welcome extends PureComponent {

  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    date: new Date(),
    text: null,
    pickerIsShown: false,
    inputIsShown: false,
  }

  onDateChange = (date) => {
    this.setState({ date });
  }

  onTextChange = (text) => {
    this.setState({ text });
  }

  submit = () => {
    const { date, text } = this.state;

    const to = moment(date).startOf('day').toDate();
    const from = new Date();
    const diff = to.getTime() - from.getTime();

    if (diff <= 0) return;

    this.props.navigator.push('counter', { from, to, text });
  }

  togglePicker = () => {
    const { pickerIsShown } = this.state;
    this.setState({ pickerIsShown: !pickerIsShown });
  }

  toggleInput = () => {
    const { inputIsShown } = this.state;
    this.setState({ inputIsShown: !inputIsShown });
  }

  render() {
    const { pickerIsShown, inputIsShown, date, text } = this.state;
    const value = text || PLACEHOLDER;
    const styles = text ? s.welcome__value : s.welcome__placeholder;

    return (
      <Container>
        <View style={s.welcome__form}>
          <Text style={s.welcome__text}>
            Let’s count <Text style={s.welcome__placeholder} onPress={this.togglePicker}>days</Text> to <Text style={styles} onPress={this.toggleInput}>{value}</Text>.
          </Text>

          <Picker
            open={pickerIsShown}
            toggle={this.togglePicker}
            date={date}
            onChange={this.onDateChange}
          />

          <Input
            open={inputIsShown}
            toggle={this.toggleInput}
            text={text}
            placeholder={PLACEHOLDER}
            onChange={this.onTextChange}
          />

          <TouchableOpacity
            onPress={this.submit}
            activeOpacity={0.75}
            style={s.welcome__submit}
          >
            <Image source={require('../images/submit.png')} />
          </TouchableOpacity>
        </View>

        <Text style={s.welcome__footer}>
          Photographs by <Text style={s.welcome__link} onPress={() => Linking.openURL('https://www.instagram.com/jeremdsgn/')}>@jeremdsgn</Text>
        </Text>
      </Container>
    );
  }
}

const s = StyleSheet.create({
  welcome__form: {
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 200,
  },

  welcome__text: {
    paddingHorizontal: 30,

    fontFamily: 'Avenir-Medium',
    fontSize: 32,
    color: '#333',
    lineHeight: 46,
    textAlign: 'center',
  },

  welcome__placeholder: {
    color: '#c1ccdb',
    textDecorationLine: 'underline',
  },

  welcome__value: {
    color: '#6ef09f',
    textDecorationLine: 'underline',
  },

  welcome__submit: {
    marginTop: 60,
  },

  welcome__footer: {
    marginTop: 'auto',
    marginBottom: 30,

    fontFamily: 'Avenir-Medium',
    fontSize: 15,
    color: '#c1ccdb',
    textAlign: 'center',
  },

  welcome__link: {
    color: '#a2abb8',
  },
});
