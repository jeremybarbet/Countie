/* eslint-disable no-confusing-arrow, jsx-a11y/accessible-emoji */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

import Container from '../components/container';
import datify from '../utils/date';

export default class Counter extends PureComponent {

  static propTypes = {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    const t = props.to - props.from;
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
    };
  }

  componentDidMount() {
    this.countdown = setInterval(() => {
      const t = this.state.date.total - 1000;
      this.counter(t);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  counter(t) {
    if (t <= 0) {
      this.isOver = true;
      clearInterval(this.countdown);
    }

    this.setState({ date: datify(t) });
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

  render() {
    const { to } = this.props;

    return (
      <Container>
        <Image source={require('../images/bg.png')} />

        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          style={s.counter__gradient}
        >
          <Text style={s.counter__title}>Baby + Iceland ❤️</Text>

          {this.isOver
            ? <Text style={s.counter__countdown}>It’s over ❤️</Text>
            : this.renderCounter()
          }

          <Text style={s.counter__date}>{moment(to).format('MMMM Do, YYYY')}</Text>
        </LinearGradient>

        <View style={s.counter__progress} />
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
    paddingBottom: 30,

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

    width: 110,
    height: 4,

    backgroundColor: '#6ef09f',
  },
});
