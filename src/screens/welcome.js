/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import moment from 'moment';
import isNil from 'lodash/isNil';
import { inject, observer } from 'mobx-react/native';
import { toJS } from 'mobx';

import Container from '../components/container';
import Picker from '../components/picker';
import Input from '../components/input';
import storage, { prefix } from '../utils/storage';

const PLACEHOLDER_DATE = 'date';
const PLACEHOLDER_TEXT = 'my next travel';

@inject('ui')
@observer
export default class Welcome extends Component {

  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    pickerIsShown: false,
    inputIsShown: false,
  }

  async componentDidMount() {



    try {
      // storage.clear();

    const closed = await storage.get(prefix('appClosed'));
    const remaining = await storage.get(prefix('remaining'));


    // console.log('---------', moment(closed).toDate());
    // console.log('---------', remaining);

      const last = await storage.get(prefix('last'));
      const from = await storage.get(prefix('from'));
      const to = await storage.get(prefix('to'));
      const text = await storage.get(prefix('text'));
      const progress = await storage.get(prefix('progres'));
      // const remaining = await storage.get(prefix('remaining'));

      // console.log('-----------***', toJS(this.props.ui.date))
      // console.log('-----------***', from)
      // console.log('-----------***', to)
      // console.log('-----------***', remaining)
      // console.log('-----------***', text)

      // console.log('------------- storage text', text);
      // console.log('------------- storage date', to);

      if (last && to && text) {
        // this.props.ui.timeRemaining = remaining;
        this.props.ui.timeDifference(closed, new Date());

        this.props.navigator.push('counter', {
          from: moment(from).toDate(),
          // from: new Date(),
          to: moment(to).toDate(),
          text,
          // progress,
          remaining,
        });
      }
    } catch (error) {
      console.log('Error to get asyncstorage values', error);
    }
  }

  onDateChange = (date) => {
    this.props.ui.counter.to = date;
  }

  onTextChange = (text) => {
    this.props.ui.counter.text = text;
  }

  submit = () => {
    const { navigator } = this.props;
    const { text, to: inputDate } = this.props.ui.counter;

    const to = moment(new Date().setSeconds(new Date().getSeconds() + 180)).toDate();
    // const to = moment(inputDate).startOf('day').toDate();
    const from = new Date();
    const diff = to.getTime() - from.getTime();

    if (isNil(text) || isNil(inputDate)) return;
    if (diff <= 0) return;

    // Store counter infos
    storage.set(prefix('from'), from);
    storage.set(prefix('to'), to);
    storage.set(prefix('text'), text);

    // Push to counter screen
    navigator.push('counter', { from, to, text });
  }

  togglePicker = () => {
    const { pickerIsShown } = this.state;
    this.props.ui.showDate = true;
    this.setState({ pickerIsShown: !pickerIsShown });
  }

  toggleInput = () => {
    const { inputIsShown } = this.state;
    this.setState({ inputIsShown: !inputIsShown });
  }

  render() {
    const { ui } = this.props;
    const { pickerIsShown, inputIsShown } = this.state;

    const valueDate = ui.showDate ? moment(ui.counter.to).format('DD/MM/YY') : PLACEHOLDER_DATE;
    const valueText = ui.counter.text || PLACEHOLDER_TEXT;
    const isClickable = ui.counter.to && ui.counter.text;
    const styles = state => state ? s.welcome__value : s.welcome__placeholder; // eslint-disable-line

    return (
      <Container>
        <View style={s.welcome__form}>
          <Text style={s.welcome__text}>
            Let’s count <Text style={styles(ui.showDate)} onPress={this.togglePicker}>{valueDate}</Text>{'\n'} for <Text style={styles(ui.counter.text)} onPress={this.toggleInput}>{valueText}</Text>.
          </Text>

          <Picker
            open={pickerIsShown}
            toggle={this.togglePicker}
            date={ui.counter.to}
            onChange={this.onDateChange}
          />

          <Input
            open={inputIsShown}
            toggle={this.toggleInput}
            text={ui.counter.text}
            placeholder={PLACEHOLDER_TEXT}
            onChange={this.onTextChange}
          />

          <TouchableOpacity
            onPress={this.submit}
            activeOpacity={0.75}
            style={s.welcome__submit}
          >
            <Image style={isClickable ? s.welcome__iconActive : s.welcome__icon} source={require('../images/submit.png')} />
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

  welcome__icon: {
    tintColor: '#c1ccdb',
  },

  welcome__iconActive: {
    tintColor: '#6ef09f',
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
