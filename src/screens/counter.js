import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

import Container from '../components/container';
import storage from '../utils/storage';

export default class Counter extends PureComponent {

  static propTypes = {
    from: PropTypes.string,
    to: PropTypes.string,
  }

  date = null

  componentDidMount() {
    const { from, to } = this.props;

    this.countdown = setInterval(() => {
      console.log('coucou');
      this.counter(from, to);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  counter(from, to) {
    const diff = to.getTime() - from.getTime();
    console.log('diff', diff);

    this.isOver = false;

    // if (diff <= 0) {
    //   clearInterval(this.countdown);
    //   this.isOver = true;
    // } else {
      let seconds = Math.floor(diff / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);

      hours %= 24;
      minutes %= 60;
      seconds %= 60;

      this.date = {
        days,
        hours,
        minutes,
        seconds,
      };
    // }
  }

  render() {
    const { diff, to } = this.props;
    console.log('this.date', this.date);

    return (
      <Container>
        <Image source={require('../images/bg.png')} />

        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
          style={s.counter__gradient}
        >
          <Text style={s.counter__title}>Baby + Iceland ❤️</Text>

          {this.isOver ? (
            <Text style={s.counter__countdown}>30d 23h 13m 23s</Text>
          ) : (
            <Text style={s.counter__countdown}>It’s over ❤️</Text>
          )}

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
