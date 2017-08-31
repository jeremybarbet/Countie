/* eslint-disable no-confusing-arrow, jsx-a11y/accessible-emoji */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { decorate } from 'react-mixin';
import { inject, observer } from 'mobx-react/native';
import { StyleSheet, Text, Image, Animated, Dimensions, Easing, AppState, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TimerMixin from 'react-native-timer-mixin';
import moment from 'moment';

import Container from '../components/container';
import { datify, isOver } from '../utils/date';
import storage from '../utils/storage';

const { width } = Dimensions.get('window');
const ONE_SECOND = 1000;

@inject('ui') @observer
@decorate(TimerMixin)
export default class Counter extends Component {

  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
    }).isRequired,
    ui: PropTypes.object.isRequired,
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    const t = props.to - props.from;
    const get = v => datify(t)[v];

    this.isOver = false;
    this.progress = new Animated.Value(t);

    props.ui.date = { // eslint-disable-line
      total: get('total'),
      days: get('days'),
      hours: get('hours'),
      minutes: get('minutes'),
      seconds: get('seconds'),
    };
  }

  componentWillMount() {
    this.props.ui.counterActive = true;
    AppState.addEventListener('change', this.handleStateChange);
  }

  componentDidMount() {
    this.countdown = this.setInterval(() =>
      this.counter(this.props.ui.date.total),
    ONE_SECOND);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleStateChange);
  }

  onPress = () => {
    Alert.alert(
      'Delete counter',
      'Are you sure you want to delete this counter?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: this.deleteCounter,
          style: 'destructive',
        },
      ],
    );
  }

  get width() {
    const { from, to } = this.props;
    const t = to - from;

    return {
      width: this.progress.interpolate({
        inputRange: [ONE_SECOND, t],
        outputRange: [0, width],
      }),
    };
  }

  handleStateChange = (state) => {
    const { ui } = this.props;

    if (state === 'inactive') {
      this.lastClosed = new Date();
      ui.timeRemaining = ui.date.total;
      storage.set('@countie:last_closed', this.lastClosed);
      storage.set('@countie:counter_active', ui.counterActive);
    }

    if (state === 'active') {
      ui.timeDifference(this.lastClosed, new Date());
    }
  }

  counter(t) {
    const { ui } = this.props;
    const sub = t - ONE_SECOND;
    const date = datify(sub);

    if (isOver(ui.date)) {
      this.isOver = true;
      clearInterval(this.countdown);
    }

    Animated.timing(this.progress, {
      toValue: sub,
      duration: ONE_SECOND,
      easing: Easing.linear,
    }).start();

    ui.date = date;
  }

  deleteCounter = () => {
    storage.clear();
    this.props.navigator.pop();
  }

  renderCounter = () => {
    const { days, hours, minutes, seconds } = this.props.ui.date;
    const f = (v, p) => v.toString().length > 1 ? `${v}${p}` : `0${v}${p}`;

    return (
      <Text style={s.counter__countdown}>
        {f(days, 'd')} {f(hours, 'h')} {f(minutes, 'm')} {f(seconds, 's')}
      </Text>
    );
  }

  render() {
    const { to, text } = this.props;

    return (
      <Container>
        <TouchableOpacity
          style={s.counter__close}
          onPress={this.onPress}
          activeOpacity={0.8}
        >
          <Image source={require('../images/close.png')} />
        </TouchableOpacity>

        <Image source={require('../images/bg.png')} />

        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          style={s.counter__gradient}
        >
          <Text style={s.counter__title}>{text}</Text>

          {this.isOver
            ? <Text style={s.counter__countdown}>Enjoy your time!</Text>
            : this.renderCounter()
          }

          <Text style={s.counter__date}>{moment(to).format('MMMM Do, YYYY')}</Text>
        </LinearGradient>

        <Animated.View style={[s.counter__progress, this.width]} />
      </Container>
    );
  }
}

const s = StyleSheet.create({
  counter__close: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 10,
  },

  counter__gradient: {
    justifyContent: 'flex-end',

    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,

    paddingHorizontal: 30,
    paddingBottom: 40,

    height: 280,
  },

  counter__title: {
    fontFamily: 'Avenir-Medium',
    fontSize: 32,
    color: '#fff',

    backgroundColor: 'transparent',
  },

  counter__countdown: {
    opacity: 0.8,

    fontFamily: 'Avenir-Medium',
    fontSize: 26,
    color: '#fff',
    lineHeight: 42,

    backgroundColor: 'transparent',
  },

  counter__date: {
    opacity: 0.6,

    marginTop: 4,

    fontFamily: 'Avenir-Medium',
    fontSize: 18,
    color: '#fff',

    backgroundColor: 'transparent',
  },

  counter__progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,

    width,
    height: 4,

    backgroundColor: '#6ef09f',
  },
});
