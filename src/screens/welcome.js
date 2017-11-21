/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, PushNotificationIOS } from 'react-native'; // eslint-disable-line
import moment from 'moment';
import { isNil } from 'lodash';
import { inject, observer } from 'mobx-react/native';
import { action } from 'mobx';
import { autobind } from 'core-decorators';

import Container from 'components/container';
import Picker from 'components/picker';
import Input from 'components/input';
import storage, { prefix } from 'utils/storage';
import { navigatorTypes } from 'utils/types';

import { COUNTER } from './';

const PLACEHOLDER_DATE = 'date';
const PLACEHOLDER_TEXT = 'my next travel';
const TWENTYFOUR_HOURS = 24 * 60 * 60 * 1000;

@inject('ui')
@observer
export default class Welcome extends Component {

  static propTypes = {
    ...navigatorTypes,
    ui: PropTypes.object.isRequired,
  }

  static navigatorStyle = {
    navBarHidden: true,
  }

  state = {
    pickerIsShown: false,
    inputIsShown: false,
  }

  @autobind
  @action
  onDateChange(to) {
    this.props.ui.counter.to = to;
  }

  @autobind
  @action
  onTextChange(text) {
    this.props.ui.counter.text = text;
  }

  @autobind
  submit() {
    const { ui, navigator } = this.props;
    // const { text } = ui.counter;

    // DEBUG
    const to = moment(new Date().setSeconds(new Date().getSeconds() + 60)).toDate();
    const text = 'new year with Sarah ❤️';
    // DEBUG

    // const to = moment(ui.counter.to).startOf('day').toDate();
    const from = new Date();
    const diff = to.getTime() - from.getTime();
    const dayBefore = new Date(to).setHours(new Date(to).getHours() - 24);

    // if (isNil(ui.counter.text) || isNil(ui.counter.to)) return;
    // if (diff <= 0) return;

    // Configure notifications
    if (to >= TWENTYFOUR_HOURS) {
      PushNotificationIOS.scheduleLocalNotification({
        alertBody: `Your countdown for "${text}"" is almost over, 24 hours remaining!`,
        fireDate: moment(dayBefore).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
      });
    }

    PushNotificationIOS.scheduleLocalNotification({
      alertBody: `Hey! Your countdown for "${text}" is over. Make the most of your time!`,
      fireDate: moment(to).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
    });

    // Store counter infos
    storage.set(prefix('from'), from);
    storage.set(prefix('to'), to);
    storage.set(prefix('text'), text);

    navigator.push({
      screen: COUNTER,
      passProps: { from, to, text },
    });
  }

  @autobind
  @action
  togglePicker() {
    const { pickerIsShown } = this.state;

    this.props.ui.showDate = true;
    this.setState({ pickerIsShown: !pickerIsShown });
  }

  @autobind
  toggleInput() {
    const { inputIsShown } = this.state;

    this.setState({ inputIsShown: !inputIsShown });
  }

  render() {
    const { ui } = this.props;
    const { pickerIsShown, inputIsShown } = this.state;

    const isClickable = ui.counter.to && ui.counter.text;
    const valueDate = ui.showDate ? moment(ui.counter.to).format('DD/MM/YY') : PLACEHOLDER_DATE;
    const valueText = ui.counter.text || PLACEHOLDER_TEXT;
    const styles = state => state ? s.welcome__value : s.welcome__placeholder; // eslint-disable-line

    return (
      <Container>
        <View style={s.welcome__form}>
          <Text style={s.welcome__text}>
            Let’s count <Text style={styles(ui.showDate)} onPress={this.togglePicker}>{valueDate}</Text>{'\n'}for <Text style={styles(ui.counter.text)} onPress={this.toggleInput}>{valueText}</Text>.
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
            <Image
              style={isClickable ? s.welcome__iconActive : s.welcome__icon}
              source={require('../images/submit.png')}
            />
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
  /*
  welcome__form: {
    marginTop: 200,
  },

  welcome__text: {
    paddingLeft: 40,
    paddingRight: 30,

    fontFamily: 'Avenir-Medium',
    fontSize: 32,
    color: '#333',
    lineHeight: 46,
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
    paddingHorizontal: 40,
    marginTop: 60,
  },

  welcome__icon: {
    tintColor: '#c1ccdb',
  },

  welcome__iconActive: {
    tintColor: '#6ef09f',
  },

  welcome__footer: {
    paddingHorizontal: 40,
    marginTop: 'auto',
    marginBottom: 30,

    fontFamily: 'Avenir-Medium',
    fontSize: 15,
    color: '#c1ccdb',
  },

  welcome__link: {
    color: '#a2abb8',
  },
  */
});
