/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, PushNotificationIOS } from 'react-native';
import moment from 'moment';
import { isNil, isEmpty } from 'lodash';
import { inject, observer } from 'mobx-react/native';
import { action, toJS, observable } from 'mobx';
import { autobind } from 'core-decorators';

import Container from 'components/container';
import Picker from 'components/picker';
import Input from 'components/input';
import storage, { prefix } from 'utils/storage';
import { datify } from 'utils/date';
import { navigatorTypes } from 'utils/types';

import { COUNTER } from './';

const PLACEHOLDER_DATE = 'date';
const PLACEHOLDER_TEXT = 'my next travel';
const TWENTYFOUR_HOURS = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

@inject('ui')
@observer
export default class Welcome extends Component {

  @observable
  showDate = false;

  @observable
  counterFrom = undefined;

  @observable
  counterTo = new Date();

  @observable
  counterText = undefined;

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

  firstPickDate = false
  firstPickText = false

  componentDidMount() {
    console.log('-this.props.ui.counters', toJS(this.props.ui.counters));

    // storage.clear();
  }

  @autobind
  @action
  onDateChange(to) {
    this.firstPickDate = true;
    this.counterTo = to;
  }

  @autobind
  @action
  onTextChange(text) {
    this.firstPickText = true;
    this.counterText = text;
  }

  @autobind
  submit() {
    const { ui, navigator } = this.props;
    const text = this.counterText;

    const to = moment(this.counterTo).startOf('day').toDate();
    const from = new Date();
    const diff = to.getTime() - from.getTime();
    const twentyFourHours = new Date(to).setHours(new Date(to).getHours() - 24);
    const oneHour = new Date(to).setHours(new Date(to).getHours() - 1);

    // Check if counter is valid
    if (isEmpty(text) || isNil(this.counterTo)) return;
    if (diff <= 0) return;

    // Configure notifications
    if (to >= TWENTYFOUR_HOURS) {
      PushNotificationIOS.scheduleLocalNotification({
        alertBody: `Your countdown for « ${text} » is almost over, 24 hours remaining!`,
        fireDate: moment(twentyFourHours).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
      });
    }

    if (to >= ONE_HOUR) {
      PushNotificationIOS.scheduleLocalNotification({
        alertBody: `Your countdown for « ${text} » is so close to be over, 1 hour remaining!`,
        fireDate: moment(oneHour).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
      });
    }

    PushNotificationIOS.scheduleLocalNotification({
      alertBody: `Hey! This is it, your countdown for « ${text} » is over. Make the most of your time!`,
      fireDate: moment(to).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
    });

    const name = moment(from).format('DD-MM-YY/HH:mm:ss');
    const obj = { from, to, text, status: datify(diff) };
    const counter = { [name]: obj };

    ui.counters[name] = obj;
    ui.currentCounter = name;
    storage.update(prefix('counters'), counter);

    navigator.showModal({
      screen: COUNTER,
      animationType: 'slide-up',
    });
  }

  @autobind
  @action
  togglePicker() {
    const { pickerIsShown } = this.state;

    if (pickerIsShown) {
      this.firstPickDate = true;
    }

    this.showDate = true;
    this.setState({ pickerIsShown: !pickerIsShown });
  }

  @autobind
  @action
  toggleInput() {
    const { inputIsShown } = this.state;

    if (inputIsShown) {
      this.firstPickText = true;
    }

    this.setState({ inputIsShown: !inputIsShown });
  }

  render() {
    const { pickerIsShown, inputIsShown } = this.state;

    const validDate = moment(this.counterTo).isAfter(new Date());
    const validText = !isEmpty(this.counterText);
    const isClickable = validDate && validText;

    const valueDate = this.showDate ? moment(this.counterTo).format('DD/MM/YY') : PLACEHOLDER_DATE;
    const valueText = this.counterText || PLACEHOLDER_TEXT;
    const styles = state => state ? s.welcome__value : s.welcome__placeholder;

    return (
      <Container>
        {this.firstPickDate && !validDate && (
          <Text style={s.welcome__error}>You have to select a date in the future to start the countdown.</Text>
        )}

        {this.firstPickText && !validText && (
          <Text style={s.welcome__error}>You have to choose a name to your countdown.</Text>
        )}

        <View style={s.welcome__form}>
          <Text style={s.welcome__text}>
            Let’s count <Text style={styles(this.showDate)} onPress={this.togglePicker}>{valueDate}</Text>{'\n'}for <Text style={styles(this.counterText)} onPress={this.toggleInput}>{valueText}</Text>.
          </Text>

          <Picker
            open={pickerIsShown}
            toggle={this.togglePicker}
            date={this.counterTo}
            onChange={this.onDateChange}
          />

          <Input
            open={inputIsShown}
            toggle={this.toggleInput}
            text={this.counterText}
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
  welcome__form: {
    marginTop: 200,
  },

  welcome__text: {
    marginLeft: 40,
    marginRight: 30,

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

  welcome__error: {
    position: 'absolute',
    top: 40,
    left: 40,

    paddingRight: 80,

    fontFamily: 'Avenir-Medium',
    fontSize: 15,
    color: '#a2abb8',
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
});
