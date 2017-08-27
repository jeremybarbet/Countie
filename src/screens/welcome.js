import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';

import Container from '../components/container';
import DatePicker from '../components/date-picker';

const STATUSBAR_HEIGHT = 20;

export default class Welcome extends PureComponent {

  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
    }),
  }

  static defaultProps = {
    date: new Date(),
  }

  state = {
    date: this.props.date,
    pickerIsShown: false,
  }

  submit = () => {
    const { date } = this.state;
    this.props.navigator.push('counter');
  }

  togglePicker = () => {
    const { pickerIsShown } = this.state;

    this.setState({ pickerIsShown: !pickerIsShown });
  }

  render() {
    const { pickerIsShown } = this.state;

    return (
      <Container>
        <View style={s.welcome__form}>
          <Text style={s.welcome__text}>
            Let’s count <Text style={s.welcome__placeholder} onPress={this.togglePicker}>days</Text> to <Text style={s.welcome__placeholder}>my next travel</Text>.
          </Text>

          <DatePicker
            open={pickerIsShown}
            toggle={this.togglePicker}
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
    paddingHorizontal: 50,

    fontFamily: 'Avenir-Medium',
    fontSize: 32,
    color: '#333333',
    lineHeight: 42,
    textAlign: 'center',
  },

  welcome__placeholder: {
    color: '#c1ccdb',
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
    color: '#6ef09f',
  },
});
