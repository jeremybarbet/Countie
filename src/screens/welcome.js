/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, PushNotificationIOS } from 'react-native';
import moment from 'moment';
import { isNil, isEmpty } from 'lodash';
import { inject, observer } from 'mobx-react/native';
import { action, observable } from 'mobx';

import Container from 'components/container';
import Picker from 'components/picker';
import Input from 'components/input';
import storage, { prefix } from 'utils/storage';
import { datify } from 'utils/date';
import { navigatorTypes } from 'utils/types';
import { isIpad, hasValues } from 'utils/utils';

import { COUNTER } from './';

const BATCH = ['from', 'to', 'text'];
const PLACEHOLDER_DATE = 'date';
const PLACEHOLDER_TEXT = 'my next travel';
const TWENTYFOUR_HOURS = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

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

  @observable
  showBackButton = false;

  constructor(props) {
    super(props);

    this.state = {
      pickerIsShown: false,
      inputIsShown: false,
    };

    if (props.showModal) {
      props.navigator.showModal({
        screen: COUNTER,
        animationType: 'slide-up',
      });
    }
  }

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

    // Remove old storage keys from old versions of the app
    storage.multiRemove(BATCH);

    // storage.clear();
  }

  @action
  onNavigatorEvent = (e) => {
    const { counters } = this.props.ui;

    if (e.id === 'willAppear') {
      this.showBackButton = hasValues(counters);
    }
  }

  @action
  onDateChange = (to) => {
    this.props.ui.firstPickDate = true;
    this.props.ui.counterTo = to;
  }

  @action
  onTextChange = (text) => {
    this.props.ui.firstPickText = true;
    this.props.ui.counterText = text;
  }

  @action
  submit =() => {
    const { ui, navigator } = this.props;
    const { counterText: text, counterTo } = ui;

    // DEBUG
    // const to = moment(new Date().setSeconds(new Date().getSeconds() + 60)).toDate();
    // const text = 'Birthday in Iceland with Sarah ❤️';
    // DEBUG

    const from = new Date();
    const to = moment(counterTo).startOf('day').toDate();
    const diff = to.getTime() - from.getTime();
    const twentyFourHours = new Date(to).setHours(new Date(to).getHours() - 24);
    const oneHour = new Date(to).setHours(new Date(to).getHours() - 1);

    // Check if counter is valid
    if (isEmpty(text) || isNil(counterTo)) return;
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

  @action
  togglePicker = () => {
    const { pickerIsShown } = this.state;

    if (pickerIsShown) {
      this.props.ui.firstPickDate = true;
    }

    this.props.ui.showDate = true;
    this.setState({ pickerIsShown: !pickerIsShown });
  }

  @action
  toggleInput = () => {
    const { inputIsShown } = this.state;

    if (inputIsShown) {
      this.props.ui.firstPickText = true;
    }

    this.setState({ inputIsShown: !inputIsShown });
  }

  backToModal = () => {
    this.props.navigator.showModal({
      screen: COUNTER,
      animationType: 'slide-up',
    });
  }

  render() {
    const { showDate, firstPickDate, firstPickText, counterText, counterTo } = this.props.ui;
    const { pickerIsShown, inputIsShown } = this.state;

    const validDate = moment(counterTo).isAfter(new Date());
    const validText = !isEmpty(counterText);
    const isClickable = validDate && validText;

    const valueDate = showDate ? moment(counterTo).format('DD/MM/YY') : PLACEHOLDER_DATE;
    const valueText = counterText || PLACEHOLDER_TEXT;
    const styles = state => state ? s.welcome__value : s.welcome__placeholder;

    const breakLine = isIpad() ? ' ' : '\n';

    return (
      <Container>
        {this.showBackButton && (
          <Text style={s.welcome__error} onPress={this.backToModal}>
            Back to the counters

            <Image
              style={s.welcome__arrow}
              source={require('../images/arrow.png')}
            />
          </Text>
        )}

        {firstPickDate && !validDate && (
          <Text style={s.welcome__error}>You have to select a date in the future to start the countdown.</Text>
        )}

        {firstPickText && !validText && (
          <Text style={s.welcome__error}>You have to choose a name to your countdown.</Text>
        )}

        <View style={s.welcome__form}>
          <Text style={s.welcome__text}>
            Let’s count <Text style={styles(showDate)} onPress={this.togglePicker}>{valueDate}</Text>{breakLine}for <Text style={styles(counterText)} onPress={this.toggleInput}>{valueText}</Text>.
          </Text>

          <Picker
            open={pickerIsShown}
            toggle={this.togglePicker}
            date={counterTo}
            onChange={this.onDateChange}
          />

          <Input
            open={inputIsShown}
            toggle={this.toggleInput}
            text={counterText}
            placeholder={PLACEHOLDER_TEXT}
            onChange={this.onTextChange}
          />

          <TouchableOpacity
            onPress={this.submit}
            activeOpacity={0.75}
            style={s.welcome__submit}
          >
            <Image
              style={isClickable ? [s.welcome__arrow, s.welcome__iconActive] : [s.welcome__arrow, s.welcome__icon]}
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
    paddingVertical: isIpad() ? 20 : 0,
    marginLeft: 30,
    marginRight: 30,

    fontFamily: 'Avenir-Medium',
    fontSize: isIpad() ? 48 : 32,
    color: '#333',
    lineHeight: isIpad() ? 56 : 46,
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
    alignSelf: 'flex-start',

    marginLeft: 30,
    marginTop: 60,
  },

  welcome__image: {
    width: isIpad() ? 62 : 52,
    height: isIpad() ? 62 : 52,
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
    left: 30,

    paddingRight: 80,

    fontFamily: 'Avenir-Medium',
    fontSize: 15,
    color: '#a2abb8',
  },

  welcome__arrow: {
    marginLeft: 6,

    tintColor: '#a2abb8',
  },

  welcome__footer: {
    paddingHorizontal: 30,
    marginTop: 'auto',
    marginBottom: 30,

    fontFamily: 'Avenir-Medium',
    fontSize: isIpad() ? 18 : 15,
    color: '#c1ccdb',
  },

  welcome__link: {
    color: '#a2abb8',
  },
});
