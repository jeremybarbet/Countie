/* eslint-disable no-confusing-arrow, jsx-a11y/accessible-emoji */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { decorate } from 'react-mixin';
import { StyleSheet, View, Text, Image, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TimerMixin from 'react-native-timer-mixin';
import moment from 'moment';

import Container from '../components/container';
import datify from '../utils/date';

const test = new Date().setSeconds(new Date().getSeconds() + 20);

const { width } = Dimensions.get('window');
const ONE_SECOND = 1000;

function counterOver(date) {
  const isZero = v => date[v] === 0;

  if (
    isZero('days') &&
    isZero('hours') &&
    isZero('minutes') &&
    isZero('seconds')
  ) {
    return true;
  }

  return false;
}

@decorate(TimerMixin)
export default class Counter extends PureComponent {

  static propTypes = {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    // const t = props.to - props.from;

    const t = moment(test).toDate() - new Date();
    const get = v => datify(t)[v];

    this.isOver = false;

    this.state = {
      date: {
        total: get('total'),
        days: get('days'),
        hours: get('hours'),
        minutes: get('minutes'),
        seconds: get('seconds'),
      },
      progress: new Animated.Value(0),
      value: 0,
    };
  }

  componentDidMount() {
    this.countdown = this.setInterval(() => {
      // const t = this.state.date.total - ONE_SECOND;
      const t = this.state.date.total;
      this.counter(t);
    }, ONE_SECOND);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value >= 0 && this.props.value !== prevProps.value) {
      this.update();
    }
  }

  counter(t) {
    console.log('--------- counter', t)

    console.log(this.state.date)

    // if (counterOver(this.state.date)) {
    if (t <= 0) {
      console.log('oveeeer')
      this.isOver = true;
      clearInterval(this.countdown);
    }

    // Animated.timing(this.state.progress, {
    //   toValue: t,
    //   duration: ONE_SECOND,
    // }).start();

    this.setState({
      date: datify(t - ONE_SECOND),
      value: this.state.value + (0.4 * Math.random()),
    });
  }

  renderCounter = () => {
    const { days, hours, minutes, seconds } = this.state.date;

    const zero = v => v.toString().length > 1 ? v : `0${v}`;
    const f = (v, p) => v > 0 ? `${zero(v)}${p} ` : '';

    return (
      <Text style={s.counter__countdown}>
        {f(days, 'd')}{f(hours, 'h')}{f(minutes, 'm')}{f(seconds, 's')}
      </Text>
    );
  }

  update() {
    Animated.timing(this.state.progress, {
      // easing: this.props.easing,
      duration: this.props.easingDuration,
      toValue: this.props.value,
    }).start();
  }

  get width() {
    return {
      width: this.state.progress.interpolate({
        inputRange: [0, this.state.date.total],
        outputRange: [0, width],
      }),
    };
  }

  render() {
    const { from, to, text } = this.props;

    return (
      <Container>
        <Image source={require('../images/bg.png')} />

        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          style={s.counter__gradient}
        >
          <Text style={s.counter__title}>{text}</Text>

          {this.isOver
            ? <Text style={s.counter__countdown}>It’s over ❤️</Text>
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
    fontSize: 24,
    color: '#fff',
    lineHeight: 42,

    backgroundColor: 'transparent',
  },

  counter__date: {
    opacity: 0.6,

    marginTop: 2,

    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    color: '#fff',

    backgroundColor: 'transparent',
  },

  counter__progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,

    width: 0,
    height: 4,

    backgroundColor: '#6ef09f',
  },
});
